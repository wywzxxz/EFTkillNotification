//APEX		
(function(){	
	var arg={mouse_use_per_scope_sensitivity_scalars:1}
	function arg_load()
	{
		document.querySelectorAll("#apex .remember").forEach(t=>{
			name=t.id.substr(5)
			val=t.value.trim()				
			if (/^\d+$/.test(val))	val=parseInt(val)
			else if (/^\d+\.\d+$/.test(val))	val=parseFloat(val)
			arg[name]=val
		})		
	}
	function arg_save()
	{
		document.querySelectorAll("#apex .remember").forEach(t=>{
			name=t.id.substr(5)
			t.value=arg[name]		
		})		
		save()
	}	
	//读取配置文件
	const fs=require("fs")
	function read(opt={}){
		opt.path=parsePath(document.querySelector("#apex_config").value+"\\settings.cfg")		
		var text=""+fs.readFileSync(opt.path)
		var json={order:[]}
		text=text.split(/\r?\n/)
		text.forEach(function(e){
			e=e.split(/\s+/)
			val=e.pop()
			e=e.join(' ')
			json[e]=val
			json.order.push(e)
		})										
		return json							
	}	
	document.querySelector("#apex_read").onclick=function(){
		var json=read();		
		for (i in arg) if (i in json)
		{			
			arg[i]=json[i].replace(/"/g,"")
		}
		arg_save()
		save()							
		r6drawchart()
	}
	document.querySelector("#apex_write").onclick=function(){
		var opt={}
		var json=read(opt);
		for (i in arg) if (i in json)
		{			
			json[i]='"'+arg[i]+'"'
		}
		var res=""
		json.order.forEach(t=>res+=t+" "+json[t]+"\n")
		console.log(res)		
		fs.writeFileSync(opt.path,res)
	}	
	
	//绘制图表
	r6drawchart.datas.push(function(){
		var travel=parseFloat(document.querySelector('#travel').value)		
		arg_load()		
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
		function update(){
			this.y=this.mtd/arg.mouse_sensitivity/(this.ms?arg[this.ms]:1)
			this.y= (this.y/arg.dpi) / travel
		}
		function set(newy){
			newy=newy* travel *arg.dpi
			if (!this.ms)
				arg.mouse_sensitivity=this.mtd/newy
			else
				arg[this.ms]=this.mtd/newy/arg.mouse_sensitivity
			arg_save()
		}
		var data= [	
				{x:0,y:0,label:"原点"}
				,{label:"腰射"			   ,named_x: 1,x:1,mtd:  81818*0.2,update:update,set:set}	//check										
				,{label:"1倍镜&机瞄(P2020)",named_x: 1,x:1.0*117/96,mtd:  99600*0.2,ms:"mouse_zoomed_sensitivity_scalar_0",update:update,set:set}//check
				//,{label:"机瞄(平行步枪)"   ,named_x: 1,x:1.0*150/112,mtd: 110800*0.2,ms:"mouse_zoomed_sensitivity_scalar_0",update:update,set:set}//check
				,{label:"2倍镜"            ,named_x: 2,x:1.0*199/98,mtd:  82972*0.4,ms:"mouse_zoomed_sensitivity_scalar_1",update:update,set:set}//check
				,{label:"3倍镜"            ,named_x: 3,x:1.0*296/96,mtd: 124886*0.4,ms:"mouse_zoomed_sensitivity_scalar_2",update:update,set:set}//check
				,{label:"4倍镜"            ,named_x: 4,x:1.0*389/96,mtd: 166720*0.4,ms:"mouse_zoomed_sensitivity_scalar_3",update:update,set:set}//check
				,{label:"6倍镜"            ,named_x: 6,x:1.0*594/94,mtd: 250272*0.4,ms:"mouse_zoomed_sensitivity_scalar_4",update:update,set:set}//check 小偏差
				,{label:"8倍镜"            ,named_x: 8,x:1.0*743/91,mtd: 333788*0.4,ms:"mouse_zoomed_sensitivity_scalar_5",update:update,set:set}//
				,{label:"10倍镜"           ,named_x:10,x:1.0*796/78,mtd: 417272*0.4,ms:"mouse_zoomed_sensitivity_scalar_6",update:update,set:set}//
			]
		data.push({update:infinitY.bind(null,data),label:"∞"})
		data.forEach(function(e){
			e.update=e.update || function(){};e.set=e.set || function(){}
			e.update()
		})	
		return {label: "apex",data: data,showLine: true,borderColor: "#ff0000"}
	})
})();