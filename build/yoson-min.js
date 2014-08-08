/*! frontendlabs comunity */
if("undefined"==typeof yOSON)var yOSON={};yOSON.Components={},function(){var a=function(a){this.url=a,this.status="request",this.message="",this.events={onError:function(){throw"Cant be loaded "+this.url}}};a.prototype.getStatus=function(){return this.status},a.prototype.request=function(a){var b=this;"undefined"!=typeof a&&(b.events=a),b.onRequest();var c=b.createNewScript(b.url);b.requestIE(c,function(){c.onload=function(){b.onReadyRequest()},c.onerror=function(){b.onErrorRequest()}}),document.getElementsByTagName("head")[0].appendChild(c)},a.prototype.createNewScript=function(a){var b=document.createElement("script");return b.type="text/javascript",b.src=a,b},a.prototype.onRequest=function(){this.requestCallBackEvent("onRequest")},a.prototype.onReadyRequest=function(){this.status="ready",this.requestCallBackEvent("onReady")},a.prototype.onErrorRequest=function(){this.status="error",this.requestCallBackEvent("onError")},a.prototype.requestCallBackEvent=function(a){var b=this.events[a];"function"==typeof b&&b.call(this)},a.prototype.requestIE=function(a,b){var c=this;a.readyState?a.onreadystatechange=function(){"loaded"==a.readyState||"complete"==a.readyState?(a.onreadystatechange=null,c.onReadyRequest()):c.onErrorRequest()}:b.call(c)},yOSON.Components.Dependency=a;var b=function(){this.data={},this.loaded={},this.config={staticHost:yOSON.statHost||"",versionUrl:yOSON.statVers||""}};b.prototype.setStaticHost=function(a){this.config.staticHost=a},b.prototype.getStaticHost=function(){return this.config.staticHost},b.prototype.setVersionUrl=function(a){this.config.versionUrl=a},b.prototype.getVersionUrl=function(){var a="";return""!==this.config.versionUrl&&(a=this.config.versionUrl),a},b.prototype.transformUrl=function(a){var b="",c=/((http?|https):\/\/)(www)?([\w-]+\.\w+)+(\/[\w-]+)+\.\w+/g;return b=c.test(a)?a:this.config.staticHost+a+this.getVersionUrl()},b.prototype.generateId=function(a){return-1!=a.indexOf("//")?a.split("//")[1].split("?")[0].replace(/[/.:]/g,"_"):a.split("?")[0].replace(/[/.:]/g,"_")},b.prototype.addScript=function(b){var c=this.generateId(b);return this.alreadyInCollection(c)?"the dependence already appended":(this.data[c]=new a(b),this.data[c].request(),!0)},b.prototype.ready=function(a,b){var c=0,d=this,e=function(f){if(c<f.length){var g=d.transformUrl(f[c]);d.addScript(g),d.avaliable(g,function(){c++,e(a)})}else b.apply(d)};e(a)},b.prototype.avaliable=function(a,b){var c=this,d=c.generateId(a),e=c.getDependency(a);if(this.alreadyLoaded(d))return!0;var f=setInterval(function(){"ready"==e.getStatus()&&(c.loaded[d]=!0,clearInterval(f),b.apply(c)),"error"==e.getStatus()&&(b=null,clearInterval(f))},500)},b.prototype.getDependency=function(a){var b=this.generateId(a);return this.data[b]},b.prototype.alreadyInCollection=function(a){return this.data[a]},b.prototype.alreadyLoaded=function(a){return"undefined"!=typeof this.loaded[a]},yOSON.Components.DependencyManager=b;var c=function(a){this.entityBridge=a,this.moduleInstance="",this.status="stop"};c.prototype.create=function(a){this.moduleDefinition=a},c.prototype.generateModularDefinition=function(a,b){return"function"==typeof b?function(){try{return b.apply(this,arguments)}catch(c){console.log(a+"(): "+c.message)}}:b},c.prototype.start=function(a){var b=this.dealParamaterOfModule(a),c=this.moduleDefinition(this.entityBridge);for(var d in c){var e=c[d];c[d]=this.generateModularDefinition(d,e)}this.moduleInstance=c,this.runInitMethodOfModule(b)},c.prototype.dealParamaterOfModule=function(a){var b={};return"undefined"!=typeof a&&(b=a),b},c.prototype.runInitMethodOfModule=function(a){var b=this.moduleInstance;"function"==typeof b.init&&(this.setStatusModule("run"),b.init(a))},c.prototype.setStatusModule=function(a){this.status=a},c.prototype.getStatusModule=function(){return this.status},yOSON.Components.Modular=c;var d=function(){this.modules={}};d.prototype.updateStatus=function(a,b){this.modules[a]=b},d.prototype.eachModules=function(a){for(var b in this.modules){var c=this.modules[b];a.call(this,c)}},d.prototype.getTotalModulesByStatus=function(a){var b=0;return this.eachModules(function(c){c===a&&b++}),b},d.prototype.getTotalModulesRunning=function(){return this.getTotalModulesByStatus("run")},d.prototype.getTotalModulesToStart=function(){return this.getTotalModulesByStatus("toStart")+this.getTotalModulesRunning()};var e=function(){this.modules={},this.runningModules={},this.entityBridge={},this.alreadyAllModulesBeRunning=!1,this.syncModules=[],this.objMonitor=new d};e.prototype.addMethodToBrigde=function(a,b){this.entityBridge[a]=b},e.prototype.addModule=function(a,b){var d=this.modules;this.getModule(a)||(d[a]=new c(this.entityBridge),d[a].create(b))},e.prototype.getModule=function(a){return this.modules[a]},e.prototype.runModule=function(a,b){var c=this.getModule(a);this.getModule(a)&&(c.setStatusModule("start"),this.dataModule(a,b),this.runQueueModules())},e.prototype.syncModule=function(a){var b=this,c=b.getModule(a);b.objMonitor.updateStatus(a,"toStart"),b.syncModules.push(a)},e.prototype.dataModule=function(a,b){return"undefined"!=typeof b&&(this.modules[a].data=b),this.modules[a].data},e.prototype.runQueueModules=function(){var a=this,b=0,c=function(d){if(d.length>b){var e=d[b];a.whenModuleHaveStatus(e,"start",function(b,c){a.objMonitor.updateStatus(b,"run");var d=a.dataModule(b);c.start(d)}),a.whenModuleHaveStatus(e,"run",function(){b++,c(d)})}};c(a.syncModules)},e.prototype.whenModuleHaveStatus=function(a,b,c){var d=this.getModule(a),e=setInterval(function(){d.getStatusModule()===b&&(c.call(this,a,d),clearInterval(e))},20)},e.prototype.allModulesRunning=function(a,b){var c=this,d=c.objMonitor;if(this.alreadyAllModulesBeRunning)b.call(c);else var e=setInterval(function(){d.getTotalModulesToStart()>0?d.getTotalModulesToStart()===d.getTotalModulesRunning()?(b.call(c),this.alreadyAllModulesBeRunning=!0,clearInterval(e)):a.call(c):(b.call(c),this.alreadyAllModulesBeRunning=!0,clearInterval(e))},200)},yOSON.Components.ModularManager=e;var f=function(){this.events={}};f.prototype.subscribe=function(a,b,c){var d=this;this.finderEvents(a,function(){},function(a){d.addEvent(a,b,c)})},f.prototype.publish=function(a,b){var c=this;this.finderEvents([a],function(a,d){var e=d.instanceOrigin,f=d.functionSelf,g=c.validateArguments(b);f.apply(e,g)},function(){})},f.prototype.validateArguments=function(a){var b=[];return"undefined"!=typeof a&&(b=a),b},f.prototype.stopSubscribe=function(a){var b=this;this.finderEvents(a,function(a,c){b.removeEvent(a)},function(){})},f.prototype.addEvent=function(a,b,c){var d={};return d.instanceOrigin=c,d.functionSelf=b,this.events[a]=d,this},f.prototype.removeEvent=function(a){delete this.events[a]},f.prototype.eventAlreadyRegistered=function(a){var b=!1;return this.getEvent(a)&&(b=!0),b},f.prototype.getEvent=function(a){return this.events[a]},f.prototype.finderEvents=function(a,b,c){for(var d=this,e=0;e<a.length;e++)d.eachFindEvent(a[e],b,c)},f.prototype.eachFindEvent=function(a,b,c){var d=this;if(d.eventAlreadyRegistered(a)){var e=d.getEvent(a);b.call(d,a,e)}else c.call(d,a)},yOSON.Components.Comunicator=f;var g=function(a){this.modules=a.modules,this.modules.allModules=function(){},this.modules.byDefault=function(){},this.controllers={byDefault:function(){}},this.actions={byDefault:function(){}}};g.prototype.appendMethod=function(a,b,c){"function"!=typeof a[b]&&(a[b]=c)},g.prototype.overrideModuleLevel=function(a,b){this.appendMethod(b,"allControllers",function(){}),this.modules[a]=b,this.modules=this.modules},g.prototype.setControllers=function(a){this.controllers=this.modules[a].controllers},g.prototype.overrideControllerLevel=function(a,b){this.appendMethod(b,"allActions",function(){}),this.controllers[a]=b},g.prototype.setActions=function(a){this.actions=this.controllers[a].actions},g.prototype.getLevel=function(a){return this[a]},g.prototype.getNodeByLevel=function(a,b){return this[a][b]},g.prototype.getDefaultMethodInLevel=function(a){this[a].byDefault()};var h=function(a){this.objSchema=new g(a)};h.prototype.init=function(a,b,c){var d=this.checkLevelName(a),e=this.checkLevelName(b),f=this.checkLevelName(c),g=this.objSchema;this.runModuleLevel(d,function(a){a.allControllers(),this.runControllerLevel(e,function(a){a.allActions(),this.runActionLevel(f,function(a){a()})})})},h.prototype.checkLevelName=function(a){var b="";return"undefined"!=typeof a&&(b=a),b},h.prototype.runModuleLevel=function(a,b){var c=this.objSchema,d=c.getLevel("modules");if(d.allModules(),d[a]){var e=d[a];c.overrideModuleLevel(a,e),c.setControllers(a),b.call(this,e)}else c.getDefaultMethodInLevel("modules")},h.prototype.runControllerLevel=function(a,b){var c=this.objSchema,d=c.getLevel("controllers");if(d[a]){var e=d[a];c.setActions(a),b.call(this,e)}else c.getDefaultMethodInLevel("controllers")},h.prototype.runActionLevel=function(a,b){var c=this.objSchema,d=c.getLevel("actions");if(d[a]){var e=d[a];b.call(this,e)}else c.getDefaultMethodInLevel("actions")},yOSON.Components.Loader=h;var i=new yOSON.Components.ModularManager,j=new yOSON.Components.DependencyManager,k=new yOSON.Components.Comunicator,l={};return yOSON.AppCore=function(){i.addMethodToBrigde("events",function(a,b,c){k.subscribe(a,b,c)}),i.addMethodToBrigde("trigger",function(a,b){var c={};i.allModulesRunning(function(){c[a]=b},function(){for(var d in c)k.publish(d,c[d]);k.publish(a,b)})});var a=function(a,b){l[a]=b},b=function(a){var b=[];return l[a]&&(b=l[a]),b};return{getStatusModule:function(a){var b=i.getModule(a);return b.getStatusModule()},whenModule:function(a,b,c){i.whenModuleHaveStatus(a,b,function(){c.call(this)})},addModule:function(b,c,d){a(b,d),i.addModule(b,c)},runModule:function(a,c){var d=b(a),e=i.getModule(a);i.syncModule(a),j.ready(d,function(){i.runModule(a,c)})},setStaticHost:function(a){j.setStaticHost(a)},setVersionUrl:function(a){j.setVersionUrl(a)}}}(),yOSON}();
//# sourceMappingURL=yoson.min.map