(function(){	
	var arg=[]
	var target="#customms"
	function arg_load()
	{		
		try{
			t=localStorage.getItem(target)
			if (t)
				arg=JSON.parse(""+t)
		}catch(e){}
		//标准化		
		arg.sort(function(a,b){function p(x){if (isNaN(x) || x==null) return 1E100;return x;};return p(a.x)-p(b.x)});
		while (arg.length>=2 && (isNaN(arg[arg.length-2].x) || arg[arg.length-2].x==null) ) arg.pop()
		if (arg.length==0 || !(isNaN(arg[arg.length-1].x) || arg[arg.length-1].x==null))
			arg.push({x:NaN,y:NaN})		
		//创建html面板
		var table=document.querySelector(target+" table")
		var trs=table.querySelectorAll("tr:not(:first-child)") ||[]		
		for(var i=trs.length;i<arg.length;++i)
		{
			var tr=document.createElement("tr");table.append(tr);			
			
			var td=document.createElement("td");tr.append(td);
			var input=document.createElement("input");td.append(input);
			input.onchange=function(){arg_save();r6drawchart()};
			
			var td=document.createElement("td");tr.append(td);
			var input=document.createElement("input");td.append(input);
			input.onchange=function(){arg_save();r6drawchart()};
		}
		var trs=table.querySelectorAll("tr:not(:first-child)") ||[]		
		for(var i=arg.length;i<trs.length;++i)
			table.removeChild(trs[i])
		//同步数据
		var trs=table.querySelectorAll("tr:not(:first-child)")			
		for(var i=0;i<arg.length;++i)
		{
			trs[i].querySelectorAll("input")[0].value=arg[i].x;
			trs[i].querySelectorAll("input")[1].value=arg[i].y;
		}			
	}
	function arg_save()
	{		
		var table=document.querySelector(target+" table")
		var trs=table.querySelectorAll("tr:not(:first-child)")			
		for(var i=0;i<arg.length;++i)
		{
			arg[i].x=parseFloat(trs[i].querySelectorAll("input")[0].value);
			arg[i].y=parseFloat(trs[i].querySelectorAll("input")[1].value);
		}			
		localStorage.setItem(target,JSON.stringify(arg))	
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
		var data=JSON.parse(JSON.stringify(arg));
		while (data.length>0 && ( isNaN(data[data.length-1].x) || data[data.length-1].x==null)) data.pop()
		var table=document.querySelector(target+" table")
		var trs=table.querySelectorAll("tr:not(:first-child)")		
		for (var i=0;i<data.length;++i)			
			(function(i){
				data[i].label=data[i].x;
				data[i].set=function(newy){trs[i].querySelectorAll("input")[1].value=data[i].y=newy;arg_save()}
			})(i)
		if(data.length>=2)	data.push({update:infinitY.bind(null,data),label:"∞"})					
		data.forEach(function(e){
			e.update=e.update || function(){};e.set=e.set || function(){}
			e.update()
		})	
		return {label: "自定义曲线",data: data,showLine: true,borderWidth:5,borderColor: "lightgrey"}
	})
})();