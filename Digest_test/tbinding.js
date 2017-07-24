var Scope=function(){
    this.watchers=[];
    var self=this;
    function pageElementEventHandler(e) {
        var target = e.target || e.srcElemnt;
        var fullPropName = target.getAttribute('ng-model');

        if(fullPropName && fullPropName !== '') {
            self.proSet(fullPropName,target.value);
            self.digest();  
        }

    }
    
//主要修改模型的属性，然后去检测模型发生改变了，然后去修改页面的值。
    if(document.addEventListener) {
        document.addEventListener('keyup', pageElementEventHandler, false);
        document.addEventListener('change', pageElementEventHandler, false);
    } else {
        document.attachEvent('onkeyup', pageElementEventHandler);
        document.attachEvent('onchange', pageElementEventHandler);
    } 
//将所有要监视的值放入
   
    var elements=document.querySelectorAll('[ng-model]');
    for(var i=0;i<elements.length;i++){
        (function(i){
            self.watch(function(){
                return self.proGet(elements[i].getAttribute('ng-model'));
            },function(newValue){
            var elementType = elements[i].tagName.toLowerCase();

            if(elementType === 'input' || elementType === 'textarea' || elementType === 'select') {
                elements[i].value = newValue;
            } else {
                elements[i].innerHTML = newValue;
            }

            })

        })(i);
    }

}
Scope.prototype.watch=function(watchExp,callback){
    this.watchers.push({
        watchExp: watchExp,
        callback: callback||function(){}
    });
}
Scope.prototype.digest=function(){
    var dirty;
    do{
        dirty=false;

        for(var i=0;i<this.watchers.length;i++){
            var newValue=this.watchers[i].watchExp(),
                oldValue=this.watchers[i].last;

            if(newValue!==oldValue){
                dirty=true;
                this.watchers[i].callback(newValue);
                this.watchers[i].last=newValue;
            }

        }

    }while(dirty);

}
//返回这个user模型属性的值
Scope.prototype.proGet=function(proName){
    var pros=proName.split(".");
    var result=this;
    for(var i=0;i<pros.length;i++){
        result=result[pros[i]];
    }
    return result;
}

Scope.prototype.proSet=function(proName,value){
    var pros=proName.split(".");
    var result=this;
    for(var i=0;i<pros.length-1;i++){
        result=result[pros[i]];
    }
    result[pros[i]]=value;
    
}
