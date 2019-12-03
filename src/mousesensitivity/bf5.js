(function(){
	function upload(arg)
	{
		for (var i in arg)
		{
			var e=document.querySelector("#"+i);if (!e) continue							
			e.value=arg[i]
		}	
		save()
	}
	function read(){
		var path=parsePath(document.querySelector("#bf5config").value+"\\PROFSAVE_profile_synced")
		const fs=require("fs");
		console.log(path)
		var text=""+fs.readFileSync(path)
		var json={order:[]}
		text=text.split(/\r?\n/)
		text.forEach(function(e){
			e=e.split(/\s+/)
			json[e[0]]=e[1]								
			json.order.push(e[0])
		})										
		return json							
	}
	document.querySelector("#bf5read").onclick=function(){		
		try{
			var json=read(true);
			document.querySelector("#bf5ms").value=json["GstInput.MouseSensitivity"]
			document.querySelector("#bf5ms_1_25").value=json["GstInput.SoldierZoomSensitivity1x25"]
			document.querySelector("#bf5ms_1_50").value=json["GstInput.SoldierZoomSensitivity1x50"]
			document.querySelector("#bf5ms_2").value=json["GstInput.SoldierZoomSensitivity2x00"]
			document.querySelector("#bf5ms_3").value=json["GstInput.SoldierZoomSensitivity3x00"]
			document.querySelector("#bf5ms_6").value=json["GstInput.SoldierZoomSensitivity6x00"]
			
			document.querySelector("#bf5vms").value=json["GstInput.MouseSensitivityVehicle"]		
			save()							
			r6drawchart()
		}catch(e)
		{
			alert("出错了！可能你使用的是网页版，只有客户端才支持此功能：https://github.com/wywzxxz/EFTkillNotification/releases");
		}
	}
	document.querySelector("#bf5write").onclick=function(){
		try{
			const fs=require("fs");
			var json=read(true);
			json["GstInput.MouseSensitivity"]=parseFloat(document.querySelector("#bf5ms").value)
			json["GstInput.SoldierZoomSensitivity1x25"]=parseFloat(document.querySelector("#bf5ms_1_25").value)
			json["GstInput.SoldierZoomSensitivity1x50"]=parseFloat(document.querySelector("#bf5ms_1_50").value)
			json["GstInput.SoldierZoomSensitivity2x00"]=parseFloat(document.querySelector("#bf5ms_2").value)
			json["GstInput.SoldierZoomSensitivity3x00"]=parseFloat(document.querySelector("#bf5ms_3").value)
			json["GstInput.SoldierZoomSensitivity6x00"]=parseFloat(document.querySelector("#bf5ms_6").value)
			json["GstInput.MouseSensitivityVehicle"]=parseFloat(document.querySelector("#bf5vms").value)
			var res=""
			json.order.forEach(t=>res+=t+" "+json[t]+"\n")
			var path=parsePath(document.querySelector("#bf5config").value+"\\PROFSAVE_profile_synced")
			fs.writeFileSync(path,res)
		}catch(e)
		{
			alert("出错了！可能你使用的是网页版，只有客户端才支持此功能：https://github.com/wywzxxz/EFTkillNotification/releases");
		}
	}
	///////////////
	var arg={
		 a:0.00636618283677
		,b:0.00003183091418
		,bf5ms:parseFloat( document.querySelector("#bf5ms").value )												
		,bf5ms_1_25:parseFloat( document.querySelector("#bf5ms_1_25").value )
		,bf5ms_1_50:parseFloat( document.querySelector("#bf5ms_1_50").value )
		,bf5ms_2:parseFloat( document.querySelector("#bf5ms_2").value )
		,bf5ms_3:parseFloat( document.querySelector("#bf5ms_3").value )
		,bf5ms_6:parseFloat( document.querySelector("#bf5ms_6").value )					
		,bf5dpi:parseInt( document.querySelector("#bf5dpi").value )							
		,mtd_1:31416
		
		,bf5vms:parseFloat( document.querySelector("#bf5vms").value )		
	}
	r6drawchart.datas.push(function(){
		var travel=parseFloat(document.querySelector('#travel').value);
		document.querySelector("#bf5calibration").onclick=function()
		{					
			document.querySelector('#travel').value=travel*data[1].y
			save()
			r6drawchart()
		}						
		function infinitY(data){						
			var x1,x2,y1,y2
			x1=data[data.length-3].x
			y1=data[data.length-3].y
			x2=data[data.length-2].x
			y2=data[data.length-2].y
			var that=data[data.length-1]
			that.x=100
			that.y=y1+(y2-y1)/(x2-x1)*(that.x-x1)			
		}	
		//步兵
		function update()
		{			
			this.y=1/(arg.a*arg.bf5ms+arg.b)/arg[this.ms]*(this.mtd/arg.mtd_1)				
			this.y= (this.y/arg.bf5dpi) / travel
		}
		function set(newy){
			newy=newy* travel *arg.bf5dpi																				
			arg[this.ms]=1/(newy*(arg.a*arg.bf5ms+arg.b)/(this.mtd/arg.mtd_1))
			upload(arg)
		}
		//坦克
		function updatev()
		{			
			this.y=1/(arg.a*arg.bf5vms+arg.b)/arg[this.ms]*(this.mtd/arg.mtd_1)				
			this.y= (this.y/arg.bf5dpi) / travel
		}
		function setv(newy){
			newy=newy* travel *arg.bf5dpi																				
			arg[this.ms]=1/(newy*(arg.a*arg.bf5vms+arg.b)/(this.mtd/arg.mtd_1))
			upload(arg)
		}		
		var data= [	
				{x:0,y:0}
				,{x_named:1.00,x: 1,label:"腰射/1倍镜",mtd:arg.mtd_1
					,update:function(){this.y=1/(arg.a*arg.bf5ms+arg.b);this.y= (this.y/arg.bf5dpi) / travel}
					,set:function(newy){newy=newy* travel *arg.bf5dpi;arg.bf5ms=(1/newy-arg.b)/arg.a;upload(arg)}
				}
				,{x_named:1.00,x: 1,label:"坦克第三人称/机枪塔",mtd:arg.mtd_1
					,update:function(){this.y=1/(arg.a*arg.bf5vms+arg.b);this.y= (this.y/arg.bf5dpi) / travel}
					,set:function(newy){newy=newy* travel *arg.bf5dpi;arg.bf5vms=(1/newy-arg.b)/arg.a;upload(arg)}
				}
				,{x_named:1.25,x: 1.0*44/35,label:"1.25倍镜" ,mtd:38228,ms:"bf5ms_1_25",update:update,set:set}							
				,{x: 1.0*273/183,x_named:1.5,label:"1.5倍镜" ,mtd:45140,ms:"bf5ms_1_50",update:update,set:set}
				,{x: 1.0*428/215,x_named:2,label:"2倍镜" ,mtd:59164,ms:"bf5ms_2",update:update,set:set}
				,{x: 1.0*105/36,x_named:3,label:"3倍镜" ,mtd:87756,ms:"bf5ms_3",update:update,set:set}								
				,{x: 1.0*209/34,x_named:6,label:"6倍镜" ,mtd:174528,ms:"bf5ms_6",update:update,set:set
				}
			]						
		data.push({update:infinitY.bind(null,data),label:"∞"})
		data.forEach(function(e){
			e.update=e.update || function(){};e.set=e.set || function(){}
			e.update()
		})		
console.log(data)		
		return {label: "BattleField V",data: data,showLine: true,borderColor: "#00cc00"}
	})
})()