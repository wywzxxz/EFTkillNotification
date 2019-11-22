//"+title+"		
(function(){
	var title="pubg"
	var arg={
		a:0.00617139279097
		,b:1.67422e-9
	}
	function arg_load()
	{
		document.querySelectorAll("#"+title+" .remember").forEach(t=>{
			name=t.id.substr(5)
			val=t.value.trim()				
			if (/^\d+$/.test(val))	val=parseInt(val)
			else if (/^\d+\.\d+$/.test(val))	val=parseFloat(val)
			arg[name]=val
		})		
	}
	
	function arg_save()
	{
		document.querySelectorAll("#"+title+" .remember").forEach(t=>{
			name=t.id.substr(5)
			t.value=arg[name]		
		})		
		save()
	}	
	//读取配置文件
	const fs=require("fs")
	var pattern=[
		  /(\(SensitiveName="(Normal)"[^()]*LastConvertedSensitivity=)([0-9.]+[^()]*)([^()]*\))/
		 ,/(\(SensitiveName="(Scoping)"[^()]*LastConvertedSensitivity=)([0-9.]+[^()]*)([^()]*\))/		 
		 ,/(\(SensitiveName="(Scope2X)"[^()]*LastConvertedSensitivity=)([0-9.]+[^()]*)([^()]*\))/
		 ,/(\(SensitiveName="(Scope3X)"[^()]*LastConvertedSensitivity=)([0-9.]+[^()]*)([^()]*\))/
		 ,/(\(SensitiveName="(Scope4X)"[^()]*LastConvertedSensitivity=)([0-9.]+[^()]*)([^()]*\))/
	]
	function read(opt={}){
		opt.path=parsePath(document.querySelector("#"+title+"_config").value+"\\GameUserSettings.ini")		
		var text=""+fs.readFileSync(opt.path)
		//console.log(text)
		var json={}
		pattern.forEach(t=>{ 			
			a=text.match(t)
			if (!a) return			
			json[a[2].toLocaleLowerCase()]=parseFloat(a[3])
		})
		json["text"]=text		
		return json							
	}				
	document.querySelector("#"+title+" .read").onclick=function(){
		var json=read();		
		for (i in arg)  if (i in json)
		{
			 arg[i]=json[i]
		}
		arg_save()
		save()							
		r6drawchart()
	}
	document.querySelector("#"+title+" .write").onclick=function(){
		var opt={}
		var json=read(opt)
		var res=json.text
		pattern.forEach(t=>{
			a=res.match(t)
			if (!a) return			
			//res=res.replace(a[0],a[1]+arg[a[2].toLocaleLowerCase()]+a[4])
			//ms2=0.002*Math.pow(Math.E,0.04605170185988092*ms1)
			ms2=arg[a[2].toLocaleLowerCase()]
			ms1=Math.log(ms2/0.002)/0.04605170185988092
			res=res.replace(a[0],'(SensitiveName="'+a[2]+'",Sensitivity='+ms1+',LastConvertedSensitivity='+ms2+')')			
			
			
		})		
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
		document.querySelector("#"+title+" .calibration").onclick=function()
		{					
			document.querySelector('#travel').value=travel*data[1].y
			save()
			r6drawchart()
		}
		function update(){			
			this.y=this.coefficient/(arg.a*arg[this.ms]+arg.b)
			this.y= (this.y/arg.dpi) / travel
		}
		function set(newy){
			newy=newy* travel *arg.dpi
			
			arg[this.ms]=(this.coefficient/newy-arg.b)/arg.a
			arg_save()
		}		
		var data= [	
				{x:0,y:0,label:"原点"}				
				,{label:"第一人称",named_x: 1,x:1.0*48/57,ms:"normal",coefficient:0.87441981,update:update,set:set}
				,{label:"第三人称",named_x: 1,x:1,ms:"normal",coefficient:1,update:update,set:set}
				,{label:"1倍镜"   ,named_x: 1,x:1.0*71/57,ms:"scoping",coefficient:1.142800711,update:update,set:set}
				,{label:"2倍镜"   ,named_x: 2,x:1.0*136/57,ms:"scope2x",coefficient:1.999950622,update:update,set:set}
				,{label:"3倍镜"   ,named_x: 3,x:1.0*210/57,ms:"scope3x",coefficient:3.000086411,update:update,set:set}
				,{label:"4倍镜"   ,named_x: 4,x:1.0*296/57,ms:"scope4x",coefficient:4.210658207,update:update,set:set}
			]
		//data.push({update:infinitY.bind(null,data),label:"∞"})
		data.forEach(function(e){
			e.update=e.update || function(){};e.set=e.set || function(){}
			e.update()
		})	

		return {label: ""+title+"",data: data,showLine: true,borderColor: "#ff8000"}
	})
})();