var arr=[
{name:"机瞄",ms:0.22906623391087141}
,{name:"全息",ms:0.24819817669800967}
 ,{name:"Monstr. 2",ms:0.1751286334781156}
]		



best=null

var t=0.000001
for (var ms=t;ms<1;ms+=t)
{
	var ans=[]	
	var dis=0
	arr.forEach(t=>{
		res=null	
		for (var dpi=100;dpi<16000;dpi+=50)
		{
			tar=dpi*ms/(1600*t.ms)
			if (res==null || Math.abs(res.tar-1)>Math.abs(tar-1) )
				res={dpi:dpi,tar:tar}
		}
		ans.push(res)
		dis+=Math.abs(res.tar-1)
	})
	if (best==null || best>dis)
	{
		best=dis
		console.log(ms,dis)
		ans.forEach((t,i)=>{	console.log("\t",t.tar,t.dpi,arr[i].name)		})	
	}
	
}