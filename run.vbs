DIM objShell
set objShell=createobject("wscript.shell")
result=objShell.Run("cmd /c npm start",0,true)