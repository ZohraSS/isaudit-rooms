"""Build: python3 build.py  ->  docs/ (GitHub Pages) + dist/ (Claude artifact versions)"""
import pathlib
ROOT = pathlib.Path(__file__).parent
core = (ROOT/'src/core.js').read_text()
ART_STUDENT_URL = 'https://claude.ai/artifact/EeXsNP1FDMkV8xyhPa8Enf'
HEAD = ('<!doctype html>\n<html lang="az">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n{extra}'
        '<style>html{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}</style>\n</head>\n<body>\n')
def page(src, url): return (ROOT/'src'/src).read_text().replace('/*CORE*/', core).replace('__STUDENT_URL__', url)
def wrap(body, extra=''): return HEAD.format(extra=extra) + body + '\n</body>\n</html>\n'
(ROOT/'dist').mkdir(exist_ok=True); (ROOT/'docs').mkdir(exist_ok=True)
(ROOT/'dist/grc-lab-student.html').write_text(page('student.html', ''))
(ROOT/'dist/grc-lab-teacher.html').write_text(page('teacher.html', ART_STUDENT_URL))
(ROOT/'docs/index.html').write_text(wrap(page('student.html', ''), '<meta name="robots" content="noindex">\n'))
(ROOT/'docs/muellim.html').write_text(wrap(page('teacher.html', 'AUTO'), '<meta name="robots" content="noindex,nofollow">\n'))
(ROOT/'docs/.nojekyll').write_text('')
print('built')
