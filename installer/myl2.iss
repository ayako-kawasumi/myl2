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
SetupIconFile=..\imgdoc\myl2.ico
OutputBaseFilename=Myl2-installer
PrivilegesRequired=lowest
AppName=Myl2
AppVersion=1.0.0
DefaultDirName={localappdata}\Myl

DisableDirPage=yes
DefaultGroupName=Y.Mizogami
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\myl.exe
Compression=lzma2
SolidCompression=yes
OutputDir=..\dist

[Files]
Source: "..\pack\myl-win32-ia32\*"; DestDir: "{app}"; Flags:recursesubdirs;

[Icons]
Name: "{userdesktop}\Myl" ;Filename: "{app}\myl.exe"
Name: "{userstartup}\Myl" ;Filename: "{app}\myl.exe"

[Run]
Filename:"{app}\myl.exe"; Flags:postinstall nowait;
