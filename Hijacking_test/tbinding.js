var Pubsub = {
    subscrib: function(ev, callback) {
        this._callbacks || (this._callbacks = {});
        (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
        return this;

    },
    publish: function() {
        var args = [].slice.call(arguments);
        var ev = args.shift();
        if (!this._callbacks) return this;
        if (!this._callbacks[ev]) return this;
        for (var i = 0; i < this._callbacks[ev].length; i++) {
            this._callbacks[ev][i].apply(this, args);
        }
        return this;

    }
}
var TBinding = (function() {
    function pageElenmentListerner(e) {
        var target = e.target || e.srcElemnt;
        var fullProName = target.getAttribute('t-binding');
        if (fullProName && fullProName !== '') {
            Pubsub.publish('ui-update-event', fullProName, target.value);
        }

    }
    //监听鼠标按下//change时间
    if (document.addEventListener) {
        document.addEventListener('keyup', pageElenmentListerner, false);
        document.addEventListener('change', pageElenmentListerner, false);
    } else {
        document.attachEvent('onkeyup', pageElenmentListerner);
        document.attachEvent('onchange', pageElenmentListerner);
    }
    //要订阅一个模型更新事件，当model发生变化时，修改ui
    Pubsub.subscrib('model-update-event', function(fullProName, proVale) {
        var elements = document.querySelectorAll('[t-binding="' + fullProName + '"]');
        for (var i = 0; i < elements.length; i++) {
            var elementType = elements[i].tagName.toLowerCase();
            if (elementType === 'input' || elementType === 'textarea' || elementType === 'select') {
                elements[i].value = proVale;
            } else {
                elements[i].innerHTML = proVale;
            }
        }

    });

    return {
        'modelName': '',
        'initModel': function(modelName) {
            var self = this;
            self.modelName = modelName;
            //订阅ui事件，ui事件要去更新模型，更新模型里要去通知界面变化
            Pubsub.subscrib('ui-update-event', function(FullProName, proVale) {
                var pro = FullProName.split('.');
                //会出发defineProperty,然后publish 'model-update-event'
                eval(pro[0])[pro[1]] = proVale;
            });
            //必须创造这个对象，才能调用这个对象
            return Object.create(this);


        },
        'loadModel': function(modelData) {
            for (pro in modelData) {
                this.defineObjPro(this,pro, modelData[pro]);

            }

        },
        'defineObjPro': function(obj,proName, proVale){
            var self = this;
            var _value = proVale || '';
            
                Object.defineProperty(obj,proName,{
                    get: function(){
                        return _value;
                    },
                    set: function(newValue){
                        _value = newValue;
                        Pubsub.publish('model-update-event', self.modelName + "." + proName, newValue);
                    },
                    enumerable: true,
                    configurable: true
                });
                obj[proName] = _value;



        }
    };

})();