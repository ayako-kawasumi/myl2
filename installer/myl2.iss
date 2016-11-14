#ifndef arch
  #define arch = "ia32"
#endif
[Languages]
Name:"ja"; MessagesFile: "compiler:Languages\Japanese.isl"
[Code]
function InitializeSetup():Boolean;
var
  ResultCode: Integer;
begin
  Exec(ExpandConstant('taskkill.exe'), '/f /im "myl2.exe"', '', SW_HIDE,
  ewWaitUntilTerminated, ResultCode);
  Result := True;
end;
[Setup]
SetupIconFile=..\img\logo.ico
OutputBaseFilename=Myl2-{#arch}-installer
PrivilegesRequired=lowest
AppName=Myl2
AppVersion=1.0.0
DefaultDirName={localappdata}\Myl

DisableDirPage=yes
DefaultGroupName=Y.Mizogami
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\myl2.exe
Compression=lzma2
SolidCompression=yes
OutputDir=..\dist



[Files]
Source: "..\pack\myl2-win32-{#arch}\*"; DestDir: "{app}"; Flags:recursesubdirs ignoreversion;
[Icons]
Name: "{userdesktop}\Myl2" ;Filename: "{app}\myl2.exe"
Name: "{userstartup}\Myl2" ;Filename: "{app}\myl2.exe"

[Run]
Filename:"{app}\myl2.exe"; Flags:postinstall nowait;
