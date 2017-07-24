var user=TBinding.initModel('user');
user.loadModel({
    'name': 'cms',
    'age': 26,
    'gender': 1
});

user.incAge=function(){
	// this.updateModel('age',user.age+1);
	//可以根据这种方式更新模型
	this.age+=1;
};

user.decAge=function(){
	// this.updateModel('age',user.age+1);
	this.age-=1;
};