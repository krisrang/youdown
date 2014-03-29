; YouDown
; Installer Source
; Version 1.0

;Include Modern UI
!include "MUI2.nsh"

;General Settings
Name "YouDown"
Caption "YouDown"
BrandingText "YouDown"
OutFile "YouDownSetup.exe"
CRCCheck on
SetCompressor /SOLID lzma

;Default installation folder
InstallDir "$APPDATA\YouDown"

;Request application privileges
RequestExecutionLevel user

;Define UI settings
!define MUI_LICENSEPAGE_BGCOLOR /GRAY
!define MUI_UI_HEADERIMAGE_RIGHT "..\..\images\icon.png"
!define MUI_ICON "..\..\images\youdown.ico"

;Define the pages
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

;Load Language Files
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Afrikaans"
!insertmacro MUI_LANGUAGE "Albanian"
!insertmacro MUI_LANGUAGE "Arabic"
; !insertmacro MUI_LANGUAGE "Asturian"
!insertmacro MUI_LANGUAGE "Basque"
!insertmacro MUI_LANGUAGE "Belarusian"
!insertmacro MUI_LANGUAGE "Bosnian"
!insertmacro MUI_LANGUAGE "Breton"
!insertmacro MUI_LANGUAGE "Bulgarian"
!insertmacro MUI_LANGUAGE "Catalan"
!insertmacro MUI_LANGUAGE "Croatian"
!insertmacro MUI_LANGUAGE "Czech"
!insertmacro MUI_LANGUAGE "Danish"
!insertmacro MUI_LANGUAGE "Dutch"
!insertmacro MUI_LANGUAGE "Esperanto"
!insertmacro MUI_LANGUAGE "Estonian"
!insertmacro MUI_LANGUAGE "Farsi"
!insertmacro MUI_LANGUAGE "Finnish"
!insertmacro MUI_LANGUAGE "French"
!insertmacro MUI_LANGUAGE "Galician"
; !insertmacro MUI_LANGUAGE "Georgian"
!insertmacro MUI_LANGUAGE "German"
!insertmacro MUI_LANGUAGE "Greek"
!insertmacro MUI_LANGUAGE "Hebrew"
!insertmacro MUI_LANGUAGE "Hungarian"
!insertmacro MUI_LANGUAGE "Icelandic"
!insertmacro MUI_LANGUAGE "Indonesian"
!insertmacro MUI_LANGUAGE "Irish"
!insertmacro MUI_LANGUAGE "Italian"
!insertmacro MUI_LANGUAGE "Japanese"
!insertmacro MUI_LANGUAGE "Korean"
!insertmacro MUI_LANGUAGE "Kurdish"
!insertmacro MUI_LANGUAGE "Latvian"
!insertmacro MUI_LANGUAGE "Lithuanian"
!insertmacro MUI_LANGUAGE "Luxembourgish"
!insertmacro MUI_LANGUAGE "Macedonian"
!insertmacro MUI_LANGUAGE "Malay"
!insertmacro MUI_LANGUAGE "Mongolian"
!insertmacro MUI_LANGUAGE "Norwegian"
!insertmacro MUI_LANGUAGE "NorwegianNynorsk"
; !insertmacro MUI_LANGUAGE "Pashto"
!insertmacro MUI_LANGUAGE "Polish"
!insertmacro MUI_LANGUAGE "Portuguese"
!insertmacro MUI_LANGUAGE "PortugueseBR"
!insertmacro MUI_LANGUAGE "Romanian"
!insertmacro MUI_LANGUAGE "Russian"
; !insertmacro MUI_LANGUAGE "ScotsGaelic"
!insertmacro MUI_LANGUAGE "Serbian"
!insertmacro MUI_LANGUAGE "SerbianLatin"
!insertmacro MUI_LANGUAGE "SimpChinese"
!insertmacro MUI_LANGUAGE "Slovak"
!insertmacro MUI_LANGUAGE "Slovenian"
!insertmacro MUI_LANGUAGE "Spanish"
!insertmacro MUI_LANGUAGE "SpanishInternational"
!insertmacro MUI_LANGUAGE "Swedish"
!insertmacro MUI_LANGUAGE "Thai"
!insertmacro MUI_LANGUAGE "TradChinese"
!insertmacro MUI_LANGUAGE "Turkish"
!insertmacro MUI_LANGUAGE "Ukrainian"
!insertmacro MUI_LANGUAGE "Uzbek"
; !insertmacro MUI_LANGUAGE "Vietnamese"
!insertmacro MUI_LANGUAGE "Welsh"

Section ; Node Webkit Files

  ;Delete existing install
  RMDir /r "$INSTDIR"

  ;Set output path to InstallDir
  SetOutPath "$INSTDIR\node-webkit"

  ;Add the files
  File "..\..\build\releases\YouDown\win\YouDown\*"

SectionEnd

Section ; App Files

  ;Set output path to InstallDir
  SetOutPath "$INSTDIR\app"

  ;Add the files
  File /r /x "node_modules" /x "vendor" "..\..\bin"
  File /r /x "node_modules" /x "vendor" "..\..\css"
  File /r /x "node_modules" /x "vendor" "..\..\fonts"
  File /r /x "node_modules" /x "vendor" "..\..\images"
  File /r /x "node_modules" "..\..\js"
  File /r /x "node_modules" /x "vendor" "..\..\language"
  File /r /x "grunt*" /x "grunt" /x "bower" /x "ember-template-compiler" /x "handlebars" "..\..\node_modules"
  File "..\..\index.html"
  File "..\..\package.json"

SectionEnd

Section ; Shortcuts

  SetOutPath "$INSTDIR"
  File /oname=app.ico "..\..\images\youdown.ico"

  ;Working Directory
  SetOutPath "$INSTDIR"

  ;Start Menu Shortcut
  RMDir /r "$SMPROGRAMS\YouDown"
  CreateDirectory "$SMPROGRAMS\YouDown"
  CreateShortCut "$SMPROGRAMS\YouDown\YouDown.lnk" "$INSTDIR\node-webkit\YouDown.exe" "app" "$INSTDIR\app.ico" "" "" "" "Start YouDown"

  ;Desktop Shortcut
  Delete "$DESKTOP\YouDown.lnk"
  CreateShortCut "$DESKTOP\YouDown.lnk" "$INSTDIR\node-webkit\YouDown.exe" "app" "$INSTDIR\app.ico" "" "" "" "Start YouDown"

SectionEnd