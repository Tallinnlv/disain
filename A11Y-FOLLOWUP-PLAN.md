a11y follow-up plaan (15.09)

kontekst: PR #14 läks eile mergesse, st kõik 27 html templatet, 7 shared scripti ja docs shell on wcag 2.1 AA peal ja axe annab 0 violationit (27 lehte / 307 example iframe'i production buildis). see fail on hand-off ülejäänud asjadele mis sinna PRi ei läinud. untracked on meelega, ära commiti, kustuta ära kui punkt 2 on tehtud

repo reeglid ikkagi (CLAUDE.md): iga task oma branchile värske maini pealt, conventional commits, mitte mingit claude attributionit, commit lokaalselt ja owner publishib/mergeb ise kui ei ole teisiti öeldud, peale merget branch maha nii lokaalselt kui originist. ja mitte kunagi `yarn build` kui dev server jookseb, muidu tuleb see gtag overlay jama


status 15.09 (uuendatud)

1. accessibility tabid on merges, PR #15 (rebase and merge), branch kustutatud
2. deploy on tehtud 15.09 ~14:10, main `b07ef6f8` on live. esimene upload läks katki (IIS ei luba lftp temp faili rename'i üle olemasoleva, st vanad failid jäid alles ja --delete võttis vanad bundle'id ära), teine kord `set xfer:use-temp-file no` + `--no-perms` ga läks läbi, script on parandatud. backup enne deploy'd on `~/Desktop/disain-backup-2026-09-15-1353`
3. pisiasjad, pole alustatud, optional
4. tooltipi keyboard bug on merges, PR #16 (squash), branch ja worktree kustutatud, `claude/bold-pasteur-98bf75` kah maha
5. focus ring ainult klaviatuuriga (:focus-visible) on merges, PR #17 (squash), vana `fix/focus-visible-on-click` branch maha. deployitud (ja phone inputi keyboard highlight css tuli alles nüüd kaasa)

main on prg `ec1ae0aa`, githubis on ainult main, avatud PRe pole. live on kah `ec1ae0aa` (deploy 15.09 ~14:20, läks ühe korraga läbi, backup `~/Desktop/disain-backup-2026-09-15-1414`)


1. accessibility tabid (done, `docs/component-a11y-content`)

mis sisse läks: `4f9a337a` paneb `a11y={<A11y />}` 25 komponendi lehe MarkdownTemplate'i sisse (docs + versioned 2.0.0), sest tglt renderdas see tab ainult popoveri lehel ja ülejäänud 25 ei andnud proppi üldse edasi. st ainult `_a11y.mdx` kirjutamine oleks mitte midagi shippinud

ja `3fc11d67` kirjutab kõik 26 `_a11y.mdx` tabi ära (Keyboard / Screen readers / Using the example / Known limits, 200-310 sõna tükk), faktid võetud `src/components/HTMLTemplates/*` ja `static/scripts/components/*.js` pealt, mitte peast. docs ja 2.0.0 koopiad on byte-identical. 1.0.0 jäi puutumata, seal on 15/17 templatet nkn teise disainiga ja tab pole sinna wireitud, nii et loremit välja ei paista

verified: `corepack yarn build` läheb läbi, tab renderdab `/docs/components/forms/select` (2.0.0) ja `/docs/next/components/feedback/tooltip` (canary) peal, console errorid puuduvad

paar parandust vana plaani kohta kui keegi vana koopiat loeb: reference tabid olid switch ja popover, mitte accordion/tabs (need olid mõlemad lorem). ja see `lorem|^\{/\*` grep ei leidnud 8 `// Accessibility content here...` stubi forms/ all. popover ei trapi Tabi (non-modal, Escape/close viib fookuse toggle'ile tagasi) ja switchil pole `aria-checked`i ja Enter ei toggle. mõlemad olemasolevad tabid kirjutati üle, vana switchi tekst oli pm valedes kohtades

PR tekst: build läheb läbi, ava `?tab=accessibility` ühel 2.0.0 ja ühel canary komponendi lehel, ja check et 1.0.0-l ikka tabi pole

peale merget:
`git checkout main && git pull`
`git branch -d docs/component-a11y-content`
`git push origin --delete docs/component-a11y-content`


2. deploy disain.tallinn.ee (peale seda kui 1 ja 4 on merges)

ci-d pole, deploy on käsitsi ftp upload `build/` kaustast

`git checkout main && git pull`
check et dev server ei jookse ja siis `corepack yarn build`. peaks tulema `[SUCCESS] Generated static files in "build"`, ainsad okei warningud on need vanad `/docs/null/…` broken linkid
`corepack yarn serve` ja vaata `/`, `/docs/components/forms/select`, `/docs/1.0.0/components/forms/phone-input`, examplid peavad olema stylitud ja selecti list peab lahti minema. ja `/docs/components/forms/select?tab=accessibility` kah, et tab on olemas
ftp user on `velvet`, parool on Triini 14.08 kirjas. hosti seal kirjas ei ole, küsi Triinilt v vaata hosting panelist enne kui midagi üles laed. parooli mitte chatti ega repo faili
laadi `build/` sisu (mitte kaust ise) web rooti, vana asemele. enne tee vanast web rootist koopia (lae alla v las host teeb snapshoti), et saaks tagasi keerata kui jama
pärast ava https://disain.tallinn.ee/ ja need samad lehed, ja üks leht hard refreshiga kah, et uus `tds-2.0.0.min.css` ja `static/scripts/components/*.js` tuleks päriselt serverist mitte cachest (need on kõigi versioonide peale shared)


3. pisiasjad (optional, igaüks oma `chore:` branch)

`_checkbox.scss`: lisa `.tds-checkboxes__input:indeterminate::before` sama reegliga nagu `--minus:checked`, et select-alli miinus ei sõltuks classist. kui tehtud siis võta see "Known limits" lõik `forms/checkbox/_a11y.mdx`-st maha (docs + 2.0.0). prg seda reeglit veel pole, kontrollisin

`yarn stylelint` ja `yarn lint` kukuvad mainis kah, sest configi faile pole. kas lisa `.stylelintrc.json` (`stylelint-config-standard-scss` on dev depsis juba olemas) v võta scriptid packages.jsonist ära, maitea kumb parem, vb viimane

template gapid mis on tabides "Known limits" all kirjas, iga üks vb oma `fix:` branch (ja siis tab docs + 2.0.0 uuendada): table caption on `div` mitte tablega seotud, sortable headeritel pole `button`/`aria-sort`i, sort script hardcodeb `#table-component`, multi-selecti header checkbox on staatiline. selectil pole form value'd. phone inputi prefix pole number fieldist viidatud ja hardcodeb `name="phone"`/`required`. date input hardcodeb `autocomplete="off"`. pagination "Page N" ja "Previous"/"Next" on hardcoded inglise keeles. textarea counteri unit on inglise keeles. accordioni heading on alati `h2`. required tärnid on igal pool ainult visuaalsed


4. tooltip script sõi Enter/Space ära (done, `fix/tooltip-keyboard-activation`)

bug: `feedback-tooltip.js` tegi `preventDefault()` Enter/Space peale igal `.tooltip-target`-il, st tooltipiga nupp (tooltip icon button, truncated chipid, progress-trackeri info nupud) ei läinud klaviatuurilt üldse käima

mis sisse läks (worktree `.claude/worktrees/bold-pasteur-98bf75`, clean): `af8256b5` teeb nii et Enter/Space toggleb tooltipi ainult siis kui vajutus on triggeri enda peal ja triggeril pole native keyboard actionit (see focusable text `span`). nupud/lingid näitavad tooltipi focusil. hover/focus show, blur/mouseleave hide ja document-level Escape jäid samaks. üks fail ja see script on kõigi versioonide peale shared. ja `81814edf` võtab selle known limiti `feedback/tooltip/_a11y.mdx` ja `actions/chip/_a11y.mdx` seest ära (docs + 2.0.0), see 1.4.13 "hoverable" limit jääb

veel teha:
verification pole commitides kirjas. enne publishi selles worktrees dev server käima, tooltip / chip / progress-tracker lehed, check et tooltipiga nupp läheb Enter/Space peale käima ja text trigger ikka toggleb. siis server kinni ja `corepack yarn build`
branch on 1 peale stacked. merge 1 enne ära, siis `git checkout fix/tooltip-keyboard-activation && git fetch && git rebase origin/main` (1 commitid kukuvad peale Rebase-and-merge'i ise välja), publish ja PR, squash on okei
peale merget branch maha lokaalselt ja originist ja `git worktree remove .claude/worktrees/bold-pasteur-98bf75` ja `git branch -D claude/bold-pasteur-98bf75` kah

