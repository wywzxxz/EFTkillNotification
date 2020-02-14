(function(){	
	var arg=[]
	var target="#eft"
	//载入数据
	helmat.forEach(t=>{
		var e=document.createElement("option")
		e.innerHTML="["+t.class+"]"+t.name+" 转向惩罚:"+((t.turnspeed*100 || 0).toFixed(0))+"% "+" 移动惩罚:"+((t.movespeed*100 || 0).toFixed(0))+"% "
		document.getElementById("efthm").append(e)
	})
	vests.forEach(t=>{
		var e=document.createElement("option")
		e.innerHTML="["+t.class+"]"+t.name+" 转向惩罚:"+((t.turnspeed*100 || 0).toFixed(0))+"% "+" 移动惩罚:"+((t.movespeed*100 || 0).toFixed(0))+"% "
		document.getElementById("eftve").append(e)
	})
	rigs.forEach(t=>{
		var e=document.createElement("option")
		e.innerHTML="["+t.class+"]"+t.name+" 转向惩罚:"+((t.turnspeed*100 || 0).toFixed(0))+"% "+" 移动惩罚:"+((t.movespeed*100 || 0).toFixed(0))+"% "
		document.getElementById("eftrg").append(e)
	})
	visors.sort((a,b)=>a.class-b.class)
	visors.forEach(t=>{
		var e=document.createElement("option")
		e.innerHTML="["+t.class+"]"+t.name+" 转向惩罚:"+((t.turnspeed*100 || 0).toFixed(0))+"% "+" 移动惩罚:"+((t.movespeed*100 || 0).toFixed(0))+"% "
		document.getElementById("eftvs").append(e)
	})
	
	
	
	
	document.getElementById("efthm").onclick=eftgear
	document.getElementById("eftve").onclick=eftgear					
	document.getElementById("eftrg").onclick=eftgear
	document.getElementById("eftvs").onclick=eftgear
	//载入选择
	console.log("loading eft gear choise")
	remember()	
	eftgear()
	function eftgear()
	{
		document.getElementById("efthmE").src=""
		document.getElementById("eftveE").src=""
		document.getElementById("eftrgE").src=""
		document.getElementById("eftvsE").src=""
		
		document.getElementById("efthmE").src=helmat[document.getElementById("efthm").selectedIndex].url
		document.getElementById("eftveE").src=vests[document.getElementById("eftve").selectedIndex].url
		document.getElementById("eftrgE").src=rigs[document.getElementById("eftrg").selectedIndex].url
		document.getElementById("eftvsE").src=visors[document.getElementById("eftvs").selectedIndex].url
		
		document.getElementById("efttdl").value=100*getgearturn()
	}								
	//写配置文件	
	function getgearturn()
	{
		return	 (helmat[document.getElementById("efthm").selectedIndex].turnspeed ||0)
				+(vests[document.getElementById("eftve").selectedIndex].turnspeed  ||0)
				+(rigs[document.getElementById("eftrg").selectedIndex].turnspeed   ||0)
				+(visors[document.getElementById("eftvs").selectedIndex].turnspeed   ||0)
				
	}	
	document.querySelector(target+" .write").onclick=function(){
		try{
			const fs=require("fs")
			var json=eftread(true)						
			json["MouseSensitivity"]=parseFloat(document.querySelector("#eftms1").value)
			json["MouseAimingSensitivity"]=parseFloat(document.querySelector("#eftms2").value)		
			
			json["bak_MouseSensitivity"]=json["MouseSensitivity"]
			if (document.getElementById("efttd").checked)
				json["MouseSensitivity"]/=(1+document.getElementById("efttdl").value/100.0)						
			try{								
				fs.writeFileSync(parsePath(document.querySelector("#eftconfig").value)+"\\shared.ini",JSON.stringify(json,null,2))
			}catch(e)
			{
				alert("塔科夫配置文件读取错误")
				console.log(e)
			}
		}catch(e){
			alert("出错了！可能你使用的是网页版，只有客户端才支持此功能：https://github.com/wywzxxz/EFTkillNotification/releases");
		}
	}
	//读取灵敏度设置
	var arg={basems:0.1}
	document.querySelectorAll(target+" .remember").forEach(t=>{
		arg[t.id]=t.value
	})
	var travel=parseFloat(document.querySelector('#travel').value)
	//灵敏度调整
	var datas=[]
	document.querySelector("#eftcalibration").onclick=function()
	{					
		document.querySelector('#travel').value=travel*data[1].y
		save()
		r6drawchart()
	}	
	function update()
	{							
		this.y=this.mtd/(arg[this.ms]/arg.basems)
		this.y=this.y/arg.eftdpi/travel
	}
	function set(newy)
	{
		newy=newy*arg.eftdpi*travel
		arg[this.ms]=this.mtd*arg.basems/newy		
		document.querySelector("#"+this.ms).value=arg[this.ms]
	}
	var data=[	
			{x:0,y:0,set:function(){},update:function(){}}
			,{x: 1,mtd:28800,x_named:1,ms:"eftms1",label:"腰射"}
			,{mtd:28799/*44300*/,x_named:1,ms:"eftms2",label:"机瞄"}
			,{mtd:48000,x_named:1,ms:"eftms2",label:"PK-06"}
			,{x: 1.0*205/68,mtd:57600,x_named:2,ms:"eftms2",label:"Monstr. 2"}
			//,{x: 1.0*315/69,mtd:72000,x_named:2,ms:"eftms2",label:"Prism 2.5x"}
			//,{x: 1.0*397/79,mtd:96000,x_named:3.5,ms:"eftms2",label:"PU 3.5x"}																
			,{mtd:144000,x_named:4,ms:"eftms2",label:"HAMR"}
			,{mtd:144000,x_named:4,ms:"eftms2",label:"BRAVO4"}			
			,{mtd:288016,x_named:4,ms:"eftms2",label:"Pilad 4x32"}
			
			
			//,{mtd:1,x_named:4,ms:"eftms2",label:"DR1/4x"}			
			//,{mtd:1,x_named:4,ms:"eftms2",label:"USP-1"}			
			//,{mtd:1,x_named:4,ms:"eftms2",label:"TA01NSN"}
			//,{mtd:1,x_named:4,ms:"eftms2",label:"TAC30"}
			//,{mtd:1,x_named:4,ms:"eftms2",label:"ADO P4"}
			//USP-1  1.0*264/36
			//TA01NSN, PS320 1/6x   1.0*320/37
			//TAC30 1.0*306/36
			//ADO P4 1.0*216/36
		]		
	data.forEach(function(e){
		e.update=e.update || update
		e.set=e.set || set
		e.updateFor=datas
		e.update=e.update || function(){};e.set=e.set || function(){}
		e.update()
	})	
	//绘制图表
	;[
		["VPO-215",{
			"机瞄":{x:1.0*52/37}
			,"PK-06":{x:1.0*52/37}
			,"Monstr. 2":{x:1.0*122/37}
			,"BRAVO4":{x:1.0*236/37}
			,"HAMR":{x:1.0*213/37}			
			,"Pilad 4x32":{x:1.0*272/37}		
			,"DR1/4x":{x:1.0*301/37}
			,"USP-1":1.0*264/36
			,"TA01NSN":1.0*320/37
			,"PS320 1/6x":   1.0*320/37
			,"TAC30": 1.0*306/36
			,"ADO P4": 1.0*216/36
		}]
		,["SA-58",{
			//"机瞄":{x:1.0*52/37}
			"PK-06":{x:1.0*52/37}
			,"Monstr. 2":{x:1.0*121/37}
			,"BRAVO4":{x:1.0*229/37}
			//,"HAMR":{x:1.0*213/37}			
			,"Pilad 4x32":{x:1.0*272/37}		
			//,"DR1/4x":{x:1.0*301/37}
			//,"USP-1":1.0*264/36
			//,"TA01NSN":1.0*320/37
			//,"PS320 1/6x":   1.0*320/37
			//,"TAC30": 1.0*306/36
			//,"ADO P4": 1.0*216/36
		}]
	]
	.forEach(function(gun){			
		var d=JSON.parse(JSON.stringify(data))
		d.forEach(function(e){			
			a=gun[1][e.label]			
			if (a) for (var i in a) e[i]=a[i]				
			e.update=update
			e.set=set
			e.updateFor=datas
			e.update=e.update || function(){};e.set=e.set || function(){}
			e.update()
		})		
		;(function(d){
			r6drawchart.datas.push(function(){
				var a= {label: "Escape From Tarkov("+gun[0]+")",data: d,showLine: true,borderColor: "#8e5ea2"}			
				datas.push(a.data)
				console.log(a)
				return a
			})
		})(d);
	})
	
})();