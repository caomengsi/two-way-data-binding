var user=TBinding.initModel('user');
user.loadModel({
    'name': 'cms',
    'age': 26,
    'gender': 1
});

user.incAge=function(){
	this.updateModel('age',user.age+1);
};

user.decAge=function(){
	this.updateModel('age',user.age+1);
};


// var user = TBinding.initModel('user');

// user.loadModel({
//     'name': 'wilber',
//     'age': 29,
//     'gender': 2
// })

// user.incAge = function() {
//     this.updateModelData('age', user.age + 1);
// }

// user.decAge = function() {
//     this.updateModelData('age', user.age - 1);
// }


