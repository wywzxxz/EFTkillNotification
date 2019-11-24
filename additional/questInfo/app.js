const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({		
		args:["--proxy-server=socks5://127.0.0.1:1080"]
		,headless: false
	});
	const page = await browser.newPage();  
		
	var quest={}
	//try{
		quest=JSON.parse(""+require("fs").readFileSync("out.txt"))
	//}catch(e){quest={}}
	
	var urls=[]
	//获取任务列表
	try {  await page.goto('https://escapefromtarkov.gamepedia.com/Quests',{waitUntil:"load",timeout:5000});} catch (e) {}
	const res = await page.evaluate(() => {
		var res=[]
		document.querySelectorAll(".wikitable tr:not(:first-child) th a").forEach(a=>res.push(a.href))
		return res
    });
	urls=res
	//console.log(res)
	//读取每个任务
	//var urls=['https://escapefromtarkov.gamepedia.com/Sanitary_Standards_-_Part_1']
	for (var i=0;i<urls.length;++i)
	{
		console.log(urls[i])		
		function found(url)
		{
			for (var i in quest)
				if(url==quest[i].url) return quest[i]
			return null
		}
		var task=found(urls[i])
		if (task)
			console.log("skip")
		else
		{	try {  await page.goto(urls[i],{waitUntil:"load",timeout:2000});} catch (e) {}
			task = await page.evaluate(() => {
				var json= {
					name:document.querySelector("#firstHeading").textContent
					,trader:document.querySelectorAll("#va-infobox0-content .va-infobox-group")[1].querySelector("a:last-child").textContent
					,previous:[]
					,next:[]
					,objiective:[]
					,rewards:[]	  
					,get:{}
					,unlock:{}
				};	
				document.querySelector("#Objectives").parentNode.nextElementSibling.querySelectorAll("li").forEach(li=>{
					li.textContent.split("\n").forEach(t=>{
						if(t) json.objiective.push(t)	
					})
					
				})
				document.querySelector("#Rewards").parentNode.nextElementSibling.querySelectorAll("li").forEach(li=>{
					json.rewards.push(li.textContent)
					if (li.textContent.toLowerCase().indexOf("unlock")>=0)
						li.querySelectorAll("a").forEach(a=>{
								json.unlock[a.textContent]=true
						})
					else
						li.querySelectorAll("a").forEach(a=>{
							json.get[a.textContent]=true
						})
				})					
				document.querySelectorAll("#va-infobox0-content .va-infobox-group")[2].querySelectorAll(".va-infobox-content")[0].querySelectorAll("a").forEach(function(a){
					json.previous.push({name:a.textContent,url:a.href})
				})
				if(document.querySelectorAll("#va-infobox0-content .va-infobox-group")[2].querySelectorAll(".va-infobox-content")[1])
				document.querySelectorAll("#va-infobox0-content .va-infobox-group")[2].querySelectorAll(".va-infobox-content")[1].querySelectorAll("a").forEach(function(a){
					json.next.push({name:a.textContent,url:a.href})
				})	
				return json
			});
		}
		task.url=urls[i]
		if(!quest[task.name]) console.log(task);
		quest[task.name]=task		
		require("fs").writeFileSync("out.txt",JSON.stringify(quest))
		task.next.forEach(t=>{if (t.url in urls) return; urls.push(t.url);})		
	}	
  await browser.close();
})();