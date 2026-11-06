# keunhong.github.io

- Feel free to borrow this template.
- Make sure to update all relevant fields in `_config.yml` and `_data`.

## Local preview

Run `bundle install` once, then `bundle exec jekyll serve --host 127.0.0.1`.
The preview is available at `http://127.0.0.1:4000`. Restart the server after
changing `_config.yml`.

The homepage reads its biography, position and affiliation from `_config.yml`
and publications from `_data/publications.yml`. Each publication's
`thumbnail` (an image in `images/`, ideally ~1000px wide WebP) is shown beside
the entry, and `demo_url` adds an "Interactive demo" link.

The page is set in STIX Two Text (Google Fonts), with the Chinese name in
Noto Serif SC loaded only for those three glyphs. Styles live in
`css/index.scss`.

## Public CV

The website version is maintained separately in `_cv/resume-public.tex` and
exported to `files/derong-jin-cv.pdf`. The old `cv.html` URL redirects to this
same PDF. The `_cv` directory is excluded from the generated Jekyll site.

To regenerate the two-page PDF with Tectonic:

```sh
mkdir -p /tmp/derong-public-cv
tectonic --outdir /tmp/derong-public-cv _cv/resume-public.tex
cp /tmp/derong-public-cv/resume-public.pdf files/derong-jin-cv.pdf
```

Review both rendered pages before replacing the public PDF. Keep the phone
number and SonoWorld+ out of this version. SonoWorld4D is labeled only
`Under Review`; the ICLR 2027 reviewer entry in Academic Service is retained.

# License
<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
