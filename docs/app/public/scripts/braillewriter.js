let globalIndex = 0;
let stopFlag = false;
let timer = 0;
let isPaused = false;
let equivalence = [
    { char: ' ', value: 'space' }, 
    { char: '?', value: 'question-mark' },
    { char: ':', value: 'colon' },
    // { char: '^', value: 'caps' },
    // { char: '#', value: 'number' },
    { char: '\n', value: 'return' }
];
let array = [];

document.addEventListener('DOMContentLoaded', disabled, false);

function disabled() {
    document.getElementById('play').disabled = true;
    document.getElementById('stop').disabled = true;
    document.getElementById('restart').disabled = true;
};

function allLetter(inputtxt) {
    var letters = /[a-zA-Z\s.,:;\-!?^#]*$/;       // allowable letters
    if (letters.test(inputtxt)) {
        return true;
    } else {
        return false;
    }
}

async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

function recreateImg(imageName, index, array) {
    let item = document.getElementById("parent-img");
    while (item.firstChild) {
        item.removeChild(item.firstChild);
    }
    let imgString = '<img src= "imgs/' + imageName + '" class="rounded mx-auto d-block" width="500" height="200">'
        // add classes animated bounce fast to animate 
    if (index === array.length) {
        imgString = '<img src= "imgs/letter-end.svg" class="rounded mx-auto d-block" width="500" height="200">'
    }
    let div = document.createElement('div');
    div.innerHTML = imgString.trim();
    item.appendChild(div.firstChild);
}

function restart() {
    globalIndex = 0;
    stopFlag = true;
    recreateImg("letter-default.svg", globalIndex, array);
    // let value = document.getElementById("textBox").value;
    // let speed = document.getElementById("speed-slider").value;
    // let array = value.replace(/\s/g, "").split("");
    // document.getElementById("alphabet-image").src = "imgs/letter-" + array[0] + ".svg";
    // let index = 0;
    // clearInterval(timer);
    // timer = setInterval(function() {
    //     if (stopFlag === false && index < (array.length)) {
    //         globalIndex = index;
    //         index++;
    //     } else {
    //         clearInterval(timer);
    //     }
    // }, speed);

    // clearInterval(timer);
    // stoFlag = false;
    // let value = document.getElementById("textbox").value;
    // array = value.split("");
    // let index = 0;
    // letterTransition(index);
}

function stop() {
    clearInterval(timer);
    timer = 0;
    stopFlag = true;
    let imageName = '';
    if (array[globalIndex] === ' ' || array[globalIndex] === '?' || array[globalIndex] === ':' || array[globalIndex] === '\n') {
        imageName = equivalence.filter(x => x.char === array[globalIndex])[0].value;
    } else {
        imageName = array[globalIndex];
    }
    recreateImg("letter-" + imageName + ".svg", globalIndex, array);
}

function play() {
    let index = globalIndex;
    let value = (document.getElementById("textBox").value);
 
    value = value.replace("A","^a");
    value = value.replace("B","^b");
    value = value.replace("C","^c");
    value = value.replace("D","^d");
    value = value.replace("E","^e");
    value = value.replace("F","^f");
    value = value.replace("G","^g");
    value = value.replace("H","^h");
    value = value.replace("I","^i");
    value = value.replace("J","^j");

    value = value.replace("K","^k");
    value = value.replace("L","^l");
    value = value.replace("M","^m");
    value = value.replace("N","^n");
    value = value.replace("O","^o");
    value = value.replace("P","^p");
    value = value.replace("Q","^q");
    value = value.replace("R","^r");
    value = value.replace("S","^s");
    value = value.replace("T","^t");

    value = value.replace("U","^u");
    value = value.replace("V","^v");
    value = value.replace("W","^w");
    value = value.replace("X","^x");
    value = value.replace("Y","^y");
    value = value.replace("Z","^z");

    value = value.replace("1","+1"); 
    value = value.replace("2","+2");
    value = value.replace("3","+3");
    value = value.replace("4","+4");
    value = value.replace("5","+5");
    value = value.replace("6","+6");
    value = value.replace("7","+7");
    value = value.replace("8","+8");
    value = value.replace("9","+9");

    array = value.split("");
    if (index === (array.length - 1)) {
        index = 0
    }
    letterTransition(index);
}

function letterTransition(index) {
    clearInterval(timer);
    stopFlag = false;
    let speed = document.getElementById("speed").value;

    timer = setInterval(() => {
        if (!isPaused) {
            let imageName = '';
            if (stopFlag === false && index < (array.length)) {
                if (array[index] === ' ' || array[index] === '?' || array[index] === ':' || array[index] === '\n' ) {
                    imageName = equivalence.filter(x => x.char === array[index])[0].value;
                } else {
                    imageName = array[index];
                }
                recreateImg("letter-" + imageName + ".svg", index, array);
                isPaused = true;
                setTimeout(() => {
                    setTimeout(() => {
                        if (stopFlag === false) {
                            recreateImg('blank.png', index, array);
                        }
                        isPaused = false;
                    }, speed * 0.1);
                }, speed);
                globalIndex = index;
                index++;
            } else {
                active('');
                clearInterval(timer);
            }
        }

    }, speed*3);
}

function textCount() {
    string = document.getElementById("textBox").value;
    if (string === '') {
        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = true;
        document.getElementById('restart').disabled = true;
    } else {
        document.getElementById('play').disabled = false;
        document.getElementById('stop').disabled = false;
        document.getElementById('restart').disabled = false;
    }
    if (allLetter(string)) {
        document.getElementById("counter").innerHTML = string.length + '/700';
    } else {
        document.getElementById("textBox").value = string.slice(0, -1);
    }
}

function active(id) {
    document.getElementById('play').disabled = false;
    document.getElementById('stop').disabled = false;
    document.getElementById('restart').disabled = false;
    if (id !== '') {
        document.getElementById(id).disabled = true;
    }
}


/**
http://webreference.com/programming/javascript-keyboard-shortcuts/2.html
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.A
 * By Binny V A
 * License : BSD
 */
shortcut = {
    'all_shortcuts':{},//All the shortcuts are stored in this array
    'add': function(shortcut_combination,callback,opt) {
        //Provide a set of default options
        var default_options = {
            'type':'keydown',
            'propagate':false,
            'disable_in_input':false,
            'target':document,
            'keycode':false
        }
        if(!opt) opt = default_options;
        else {
            for(var dfo in default_options) {
                if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
            }
        }

        var ele = opt.target
        if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
        var ths = this;
        shortcut_combination = shortcut_combination.toLowerCase();

        //The function to be called at keypress
        var func = function(e) {
            e = e || window.event;
            
            if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                var element;
                if(e.target) element=e.target;
                else if(e.srcElement) element=e.srcElement;
                if(element.nodeType==3) element=element.parentNode;

                if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
            }
    
            //Find Which key is pressed
            if (e.keyCode) code = e.keyCode;
            else if (e.which) code = e.which;
            var character = String.fromCharCode(code).toLowerCase();
            
            if(code == 188) character=","; //If the user presses , when the type is onkeydown
            if(code == 190) character="."; //If the user presses , when the type is onkeydown
    
            var keys = shortcut_combination.split("+");
            //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
            var kp = 0;
            
            //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
            var shift_nums = {
                "`":"~",
                "1":"!",
                "2":"@",
                "3":"#",
                "4":"$",
                "5":"%",
                "6":"^",
                "7":"&",
                "8":"*",
                "9":"(",
                "0":")",
                "-":"_",
                "=":"+",
                ";":":",
                "'":"\"",
                ",":"<",
                ".":">",
                "/":"?",
                "\\":"|"
            }
            //Special Keys - and their codes
            var special_keys = {
                'esc':27,
                'escape':27,
                'tab':9,
                'space':32,
                'return':13,
                'enter':13,
                'backspace':8,
    
                'scrolllock':145,
                'scroll_lock':145,
                'scroll':145,
                'capslock':20,
                'caps_lock':20,
                'caps':20,
                'numlock':144,
                'num_lock':144,
                'num':144,
                
                'pause':19,
                'break':19,
                
                'insert':45,
                'home':36,
                'delete':46,
                'end':35,
                
                'pageup':33,
                'page_up':33,
                'pu':33,
    
                'pagedown':34,
                'page_down':34,
                'pd':34,
    
                'left':37,
                'up':38,
                'right':39,
                'down':40,
    
                'f1':112,
                'f2':113,
                'f3':114,
                'f4':115,
                'f5':116,
                'f6':117,
                'f7':118,
                'f8':119,
                'f9':120,
                'f10':121,
                'f11':122,
                'f12':123
            }
    
            var modifiers = { 
                shift: { wanted:false, pressed:false},
                ctrl : { wanted:false, pressed:false},
                alt  : { wanted:false, pressed:false},
                meta : { wanted:false, pressed:false}   //Meta is Mac specific
            };
                        
            if(e.ctrlKey)   modifiers.ctrl.pressed = true;
            if(e.shiftKey)  modifiers.shift.pressed = true;
            if(e.altKey)    modifiers.alt.pressed = true;
            if(e.metaKey)   modifiers.meta.pressed = true;
                        
            for(var i=0; k=keys[i],i<keys.length; i++) {
                //Modifiers
                if(k == 'ctrl' || k == 'control') {
                    kp++;
                    modifiers.ctrl.wanted = true;

                } else if(k == 'shift') {
                    kp++;
                    modifiers.shift.wanted = true;

                } else if(k == 'alt') {
                    kp++;
                    modifiers.alt.wanted = true;
                } else if(k == 'meta') {
                    kp++;
                    modifiers.meta.wanted = true;
                } else if(k.length > 1) { //If it is a special key
                    if(special_keys[k] == code) kp++;
                    
                } else if(opt['keycode']) {
                    if(opt['keycode'] == code) kp++;

                } else { //The special keys did not match
                    if(character == k) kp++;
                    else {
                        if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                            character = shift_nums[character]; 
                            if(character == k) kp++;
                        }
                    }
                }
            }

            if(kp == keys.length && 
                        modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                        modifiers.shift.pressed == modifiers.shift.wanted &&
                        modifiers.alt.pressed == modifiers.alt.wanted &&
                        modifiers.meta.pressed == modifiers.meta.wanted) {
                callback(e);
    
                if(!opt['propagate']) { //Stop the event
                    //e.cancelBubble is supported by IE - this will kill the bubbling process.
                    e.cancelBubble = true;
                    e.returnValue = false;
    
                    //e.stopPropagation works in Firefox.
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
        }
        this.all_shortcuts[shortcut_combination] = {
            'callback':func, 
            'target':ele, 
            'event': opt['type']
        };
        //Attach the function with the event
        if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
        else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
        else ele['on'+opt['type']] = func;
    },

    //Remove the shortcut - just specify the shortcut and I will remove the binding
    'remove':function(shortcut_combination) {
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this.all_shortcuts[shortcut_combination];
        delete(this.all_shortcuts[shortcut_combination])
        if(!binding) return;
        var type = binding['event'];
        var ele = binding['target'];
        var callback = binding['callback'];

        if(ele.detachEvent) ele.detachEvent('on'+type, callback);
        else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
        else ele['on'+type] = false;
    }
}


// keyboard shortcuts (need bugfixing and remapping)

// shortcut.add("z", 
//     function() { 
//     play();
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     );  

// shortcut.add("Space", 
//     function() { 
//     play();
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     );  

// shortcut.add("x", 
//     function() { 
//     stop();
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     );  

// shortcut.add("c", 
//     function() { 
//     restart();
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     ); 

// shortcut.add("Up", 
//     function() { 
//     document.getElementById("speed").value = document.getElementById("speed").value - 100;
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     ); 

// shortcut.add("Down", 
//     function() { 
//     document.getElementById("speed").value = document.getElementById("speed").value + 100;
//     }, 
//     { 'type':'keydown', 'propagate':true, 'target':document} 
//     ); 


