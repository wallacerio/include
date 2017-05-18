/**
 * include v1.4
 * plugin for include file extern into document html
 * 
 * by Wallace Rio <wallrio@gmail.com>
 */

// variavel global utilizada para informar se a página já foi carregada
window['include_pageLoaded'] = null;

window.include = (function(target,options){
        
    if(options && options !== -1){
        var html = options['html'] || null;
        var callback = options['callback'] || null;
        var replace = options['replace'] || null;
        var refresh = options['refresh'] || null;
        var moderefresh = options['moderefresh'] || null;
    }
     
    if(target === null || html === null)
        return false;
    



    var funcs = {
        pageLoaded:null,
        /**
         * manipulador de eventos load/click/mousemove e outros
         * @param {[type]}   objs     [elemento DOM]
         * @param {[type]}   event    [evento]
         * @param {Function} callback [função a ser executado no evento]
         * @param {[type]}   mode     [modo de captura]
         * @param {[type]}   elem2    [passagem de parametro]
         * @param {[type]}   table    [passagem de parametro]
         */
        addEvent:function(objs,event,callback,mode,par1,par2,par3){
            
            if(mode == undefined)
                mode = true;

            if(objs == undefined)
                objs = window; 
            if(objs.addEventListener){              
                return objs.addEventListener(event,function(){
                    if(callback)
                        callback(objs,par1,par2,par3);
                },mode); 
            }else if(objs.attachEvent){
                return objs.attachEvent('on'+event,function(){
                    if(callback)
                        callback(objs,par1,par2,par3);
                }); 
            }
        },     
        /**
         * função ajax
         * @param  {[json]} options [parametros json]
         * 
         */
        ajax:function(options){
            var url = options['url'] || null;
            var success = options['success'] || null;
            var progress = options['progress'] || null;
            var data = options['data'] || null;
            var type = options['type'] || 'post';

            var xhr = (function(){
                try{return new XMLHttpRequest();}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}return null;
            })();


                
                xhr.open(type, url, true);

                xhr.upload.onprogress = function (e) {
                    if (e.lengthComputable) {
                        if(progress)
                        progress(e.loaded,e.total);          
                    }
                }
                xhr.upload.onloadstart = function (e) {             
                    if(progress)
                    progress(0,e.total);
                }
                xhr.upload.onloadend = function (e) {             
                    if(progress)
                    progress(e.loaded,e.total);
                }
                xhr.upload.onprogress = function (e) {
                    if (e.lengthComputable) {
                        var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
                        console.log(ratio);
                    }
                }

                xhr.onreadystatechange = function () {

                    if(xhr.readyState > 3)
                        if(success)
                            success(xhr.responseText);              
                };

                var dataForm = new FormData();
                        

                for (key in data) {
                    if (data.hasOwnProperty(key)){                                      
                        dataForm.append(key,data[key]);
                    }
                }
            

                xhr.send(dataForm);
            },
            hashCode:function(string) {
              var hash = 0, i, chr, len;
              if (string.length === 0) return hash;
              for (i = 0, len = string.length; i < len; i++) {
                chr   = string.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
              }
              return hash;
            },
            /**
             * faz o append do javascript na DOM para executar o script do arquivo externo
             * @param  {[integer]} i [posição do script na lista]
             *
             */
            runScript:function(i,callback){                
                var scriptArray = funcs.listScripts;               
                var scriptContent = scriptArray[i] || null;
                
                if(scriptContent == null) return false;

                var script_content = scriptContent.innerHTML || null;
                var script_src = scriptContent.src || null;                    
                var script   = document.createElement("script");
                script.type  = "text/javascript";   

                // captura os parametros do script origem e inclui no script destino
                for (var a = 0, atts = scriptContent.attributes, n = atts.length; a < n; a++){                   
                    script.setAttribute(atts[a].nodeName,atts[a].value);
                }
                if(script_src) script.src  = script_src;                          
                if(script_content) script.text  = script_content;

                var getOnload = script.onload;
                var getOnError = script.onerror;

                script.onload = function(){
                    if(getOnload) getOnload();     

                    if(callback)
                        callback();

                    funcs.runScript(i+1);
                }

                script.onerror = function(){
                    if(getOnError) getOnError();
                    
                    if(callback)
                        callback();

                    funcs.runScript(i+1);
                }

                scriptContent.parentNode.insertBefore(script, scriptContent.nextSibling);
                script.parentNode.removeChild(script);
                
                
            },
            listScripts:null,

            /**
             * cria um hash simples de um texto
             * @param  {[string]} str [texto para ser convertido]
             * @return {[string]}     [texto convertido]
             */
            strhash:function( str ) {
                if (str.length % 32 > 0) str += Array(33 - str.length % 32).join("z");
                var hash = '', bytes = [], i = j = k = a = 0, dict = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','1','2','3','4','5','6','7','8','9'];
                for (i = 0; i < str.length; i++ ) {
                    ch = str.charCodeAt(i);
                    bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
                }
                var chunk_len = Math.ceil(bytes.length / 32);   
                for (i=0; i<bytes.length; i++) {
                    j += bytes[i];
                    k++;
                    if ((k == chunk_len) || (i == bytes.length-1)) {
                        a = Math.floor( j / k );
                        if (a < 32)
                            hash += '0';
                        else if (a > 126)
                            hash += 'z';
                        else
                            hash += dict[  Math.floor( (a-32) / 2.76) ];
                        j = k = 0;
                    }
                }
                return hash;
            },
            /**
             * insere o conteúdo do arquivo externo na página
             * se houver javascritp no conteúdo, então processa o script
             *
             * esta função depende da função 'runScript' e da propriedade listScripts
             * 
             * @param  {[type]}   target     [elemento DOM ou a querySelector dele]
             * @param  {[type]}   sourceHTML [conteúdo recebido via ajax]
             * @param  {Function} callback   [description]
             * @return {[type]}              [description]
             */
            append:function(target,sourceHTML,callback){            
                var targetAdjust = target;
                                       
                if(target === document || target === window)
                    targetAdjust = document.getElementsByTagName("body")[0];
                
                var sourceOBJ = targetAdjust;
                sourceOBJ.innerHTML = sourceHTML;   
                                                                                    
                if(target === document || target === window)
                    targetAdjust.appendChild(sourceOBJ);
                         
                var scriptArray = targetAdjust.querySelectorAll('script');
                funcs.listScripts = scriptArray;
                funcs.runScript(0,function(){                  
                    if(callback)
                        callback(sourceHTML);    
                });
                
                if(scriptArray.length<1){
                    if(callback)
                        callback(sourceHTML); 
                }
                
            },

            /**
             * inicializa a captura do arquivo externo
             * @param  {[type]} target      [elemento DOM ou a querySelector dele]
             * @param  {[type]} callbackIng [callback da variavel option]
             * @param  {[type]} replaceIng  [replace da variavel option]
             *
             */
            init:function(target,callbackIng,replaceIng,refreshIng,modeRefresh){
                 if(typeof target == 'string')
                    target = document.querySelector(target);
                
                var parents = this;
                // executa caso seja passado como propriedades no options da função include()
                 if(refreshIng && modeRefresh != 1){
                        (function(target,parents,callbackIng,replaceIng,refreshIng){                             
                             setInterval(function(){
                                parents.init(target,callbackIng,replaceIng,refreshIng,1);                              

                            },refreshIng);    
                        })(target,parents,callbackIng,replaceIng,refreshIng);                
                }


                funcs.ajax({
                    url:html,
                    type:'post',
                    success:function(response){  
                        if(replaceIng){
                            for (var prop in replaceIng) {
                                if(!replaceIng.hasOwnProperty(prop)) continue;
                                var re = new RegExp(prop,"g");
                                response = response.replace(re, replaceIng[prop]);             
                            }             
                        }          

                        // criado para fazer a comparação correta do conteúdo novo com o ja inserido na página
                        var ajustEl = document.createElement('div');
                        ajustEl.innerHTML = response;
                        
                       

                        if(target === document || target === window)
                            target = document.getElementsByTagName("body")[0];  

                        


                        if( funcs.strhash(target.innerHTML) == funcs.strhash(ajustEl.innerHTML) ){                                                                    
                            return false;
                        }

                        
                        funcs.append(target,response,callbackIng);
                    
                    }
                });
            },

            /**
             * inicializa a captura das tags data-include
             * @param  {[type]} target [elemento DOM ou a querySelector dele]
             *
             */
            tagInit:function(target){

                if(typeof target == 'string')
                    target = document.querySelector(target);

               

                var includesArray = target.querySelectorAll('[data-include]');

                for(var i=0;i<includesArray.length;i++){
                    var includeElement = includesArray[i];
                    var include_src = includeElement.getAttribute('data-src') || null;
                    var include_refresh = includeElement.getAttribute('data-refresh') || null;
                    var include_replace = includeElement.getAttribute('data-replace') || null;
 
                    if(include_refresh && moderefresh != 1){
                        (function(includeElement,include_src,include_refresh,include_replace){
                            
                            setInterval(function(){
                
                               window.include(includeElement,{
                                    html:include_src,
                                    replace:include_replace,
                                    moderefresh:1
                                });

                            },include_refresh);    

                        })(includeElement,include_src,include_refresh,include_replace);                
                    }

                    window.include(includeElement,{
                        html:include_src,  
                        replace:include_replace              
                    });
                }
            }
    }

    
    if(options !== -1){
        // executa aqui caso a chamada para a função include(), tenha cido feita manualmente (sem tags)        

        if( window['include_pageLoaded'] == 1){
            funcs.init(target,callback,replace,refresh);
        }else{

            funcs.addEvent(window,'load',function(el,callbackIng,replaceIng,refreshIng){                
                window['include_pageLoaded'] = 1;

               funcs.init(target,callbackIng,replaceIng,refreshIng);
            },null,callback,replace,refresh);
        }
    }else{
        // executa aqui caso a chamada para a função include(), tenha cido feita via scripts
        
        if( window['include_pageLoaded'] == 1){
            funcs.tagInit(target);
        }else{
            funcs.addEvent(window,'load',function(el,target){            
                window['include_pageLoaded'] = 1;                
                funcs.tagInit(target);
            },null,target);
        }
    }
    

  

});

// para capturar as tags data-include
// document = ponto de inicio para a captura
// -1 = instrução para procurar por tags data-include
window.include(document,-1);


/**
 * implementações:
 *
 * replace via tag ainda não funciona
 * 
 */