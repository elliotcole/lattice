# Bundled fonts and their licences

Every font shipped with Tuning Lattice is licensed under the SIL Open Font License 1.1.
The licence text is in `LICENSES/OFL-1.1.txt`; the per-family copyright notices and
Reserved Font Names required by OFL §2 are listed below, taken from each font file's
own name table. Fonts are redistributed unmodified.

| Family | Files | Copyright / Reserved Font Names | Source |
|---|---|---|---|
| Lexend | Lexend-Bold.ttf, Lexend-ExtraLight.ttf, Lexend-Light.ttf, Lexend-Medium.ttf, Lexend-Regular.ttf, Lexend-SemiBold.ttf | Copyright 2019 The Lexend Project Authors (https://github.com/googlefonts/lexend) | https://github.com/googlefonts/lexend |
| Inter | Inter-Bold.ttf, Inter-ExtraLight.ttf, Inter-Light.ttf, Inter-Medium.ttf, Inter-Regular.ttf, Inter-SemiBold.ttf | Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) | https://github.com/rsms/inter |
| IBM Plex Sans | IBMPlexSans-Bold.ttf, IBMPlexSans-ExtraLight.ttf, IBMPlexSans-Light.ttf, IBMPlexSans-Medium.ttf, IBMPlexSans-Regular.ttf, IBMPlexSans-SemiBold.ttf | Copyright 2019 IBM Corp. All rights reserved. | https://github.com/IBM/plex |
| Lato | Lato-Black.ttf, Lato-Bold.ttf, Lato-Light.ttf, Lato-Regular.ttf | Copyright (c) 2011-2015 by tyPoland Lukasz Dziedzic (http://www.typoland.com/) with Reserved Font Name "Lato". Licensed under the SIL Open Font License, Version 1.1 (http://scripts.sil.org/OFL). Reserved Font Name(s): "Lato". Lato is a trademark of tyPoland Lukasz Dziedzic. | https://www.latofonts.com/ |
| PT Sans / PT Serif | PT_Sans-Web-Bold.ttf, PT_Sans-Web-Regular.ttf, PT_Serif-Web-Bold.ttf, PT_Serif-Web-Regular.ttf | Copyright © 2009 ParaType Ltd. All rights reserved. Reserved Font Name(s): "PT Sans", "PT Serif" and "ParaType". PT Sans is a trademark of the ParaType Ltd. | https://company.paratype.com/pt-sans-pt-serif |
| Noto Serif | NotoSerif-Bold.ttf, NotoSerif-Medium.ttf, NotoSerif-Regular.ttf, NotoSerif-SemiBold.ttf | Copyright 2022 The Noto Project Authors (https://github.com/notofonts/latin-greek-cyrillic) | https://github.com/notofonts/latin-greek-cyrillic |
| Radley | Radley-Regular.ttf | Copyright 2011 The Radley Project Authors (https://github.com/googlefonts/RadleyFont) Radley is a trademark of vernon adams. | https://github.com/googlefonts/RadleyFont |
| Alice | Alice-Regular.ttf | Copyright 2011 The Alice Project Authors (https://github.com/cyrealtype/Alice) Alice is a trademark of Cyreal (http://www.cyreal.org/). | https://github.com/cyrealtype/Alice |
| iA Writer Duo S | iAWriterDuoS-Bold.ttf, iAWriterDuoS-BoldItalic.ttf, iAWriterDuoS-Italic.ttf, iAWriterDuoS-Regular.ttf | Copyright 2017 IBM Corp. and iA Inc. All rights reserved. | https://github.com/iaolo/iA-Fonts |
| iA Writer Mono S | iAWriterMonoS-Bold.ttf, iAWriterMonoS-BoldItalic.ttf, iAWriterMonoS-Italic.ttf, iAWriterMonoS-Regular.ttf | Copyright 2017 IBM Corp. and Information Architects GmbH. All rights reserved. | https://github.com/iaolo/iA-Fonts |
| HEJI2 Text | ../HEJI2Text.otf | cc 2020 Plainsound Music Edition / Marc Sabat / Thomas Nicholson. Derived from Bravura: Copyright (c) 2019, Steinberg Media Technologies GmbH, with Reserved Font Name "Bravura" (the full OFL text is embedded in the font). Reserved Font Name(s): "Bravura". Bravura is a registered trademark of Steinberg Media Technologies GmbH in the European Union and other territories. | https://www.plainsound.org/HEJI.html |

`HEJI2Text.otf` lives one level up in `src/` (it is loaded by all three apps); every
other file is in this directory. `Lato-Sargam.woff2`, previously here, was unreferenced
and has been removed.

To add a font: drop the files here, add a row above with the copyright line from the
font's name table (`opentype.js` reads it: `font.names.copyright`), and confirm the
licence is OFL or otherwise permits redistribution.
