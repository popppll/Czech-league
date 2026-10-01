#!/usr/bin/env python3
"""Složí ai3/*.js + ai3/ai3.css do HTML appky (idempotentně, mezi značkami AI3-START/AI3-END)."""
import re, glob, os, sys
root=os.path.dirname(os.path.abspath(__file__))
target=sys.argv[1] if len(sys.argv)>1 else os.path.join(root,'..','AI-Weather-1-rijna-v48.html')
parts=sorted(glob.glob(os.path.join(root,'[0-9][0-9]-*.js')))
js="window.AIW_AI3=(function(){\n'use strict';\n"+"\n".join(open(p,encoding='utf-8').read() for p in parts)+"\n})();\n"
css=open(os.path.join(root,'ai3.css'),encoding='utf-8').read() if os.path.exists(os.path.join(root,'ai3.css')) else ''
import subprocess,tempfile
tf=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8'); tf.write(js); tf.close()
r=subprocess.run(['node','--check',tf.name],capture_output=True,text=True)
if r.returncode!=0:
    print(r.stderr); sys.exit(1)
s=open(target,encoding='utf-8').read()
s=re.sub(r'<!--AI3-CSS-START-->.*?<!--AI3-CSS-END-->\n?','',s,flags=re.S)
s=re.sub(r'<!--AI3-JS-START-->.*?<!--AI3-JS-END-->\n?','',s,flags=re.S)
cssblock='<!--AI3-CSS-START-->\n<style id="aiw-ai3-css">\n'+css+'\n</style>\n<!--AI3-CSS-END-->\n'
jsblock='<!--AI3-JS-START-->\n<script id="aiw-ai3-js">\n'+js+'</script>\n<!--AI3-JS-END-->\n'
a='<style id="aiw-a11y-css">'
assert s.count(a)==1
s=s.replace(a,cssblock+a)
b='<style id="aiw-txtfold-css">'
assert s.count(b)==1
s=s.replace(b,jsblock+b)
open(target,'w',encoding='utf-8').write(s)
print('AI3: %d částí, %d kB JS, %d kB CSS'%(len(parts),len(js)//1024,len(css)//1024))
