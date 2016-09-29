<h1>Include</h1>
Plugin javascript to include content extern on HTML document
<p>Developed by Wallace Rio <wallrio@gmail.com></p>
    wallrio@gmail.com
<hr>

<h3>Cross-Browser</h3>
<p>Tested on Firefox v48 /Chrome v38</p>

<h3>Use</h3>
<p>Insert script tag and link tag into your head document html</p>
    
    <script type="text/javascript" src="include.js"></script>

<h3>Example</h3>

<h5>Mode default</h5>
Get file html extern and include inner on tag by id

Insert html on your document:

    <div id="targetHTMLTag"></div>


Javascript:   

    <script type="text/javascript">
      window.include('#targetHTMLTag',{
            html:'extern.html'           
        });
    </script>

<h5>Callback</h5>
Get file extern with callback function


    <script type="text/javascript">
      window.include('#targetHTMLTag',{
            html:'extern.html',
            callback:function(response){      
                // code run after include html on page
                // response = content of file extern
            }
        });
    </script>


<h5>Replace content</h5>
Get file extern and replace text 


    <script type="text/javascript">
      window.include('#targetHTMLTag',{
            html:'extern.html',
            replace:{
                    'text_origin_to_replace':'text_destin_to_replace',
                    '{file}':'/directory/file.html'
            }
        });
    </script>



<h5>Include on document</h5>
insert file extern on document (body)


    <script type="text/javascript">
      window.include(document,{
            html:'extern.html',
            replace:{
                    'text_origin_to_replace':'text_destin_to_replace',
                    '{file}':'/directory/file.html'
            }
        });
    </script>


    <h5>Include and reload</h5>
    refresh after 2 seconds


    <script type="text/javascript">
      window.include(document,{
            html:'extern.html',
            refresh:'2000'           
        });
    </script>


<h5>Include by Tag </h5>

    <div data-include data-src="include.html" ></div>

<h5>Include by Tag with reload of file </h5>

    <span data-include data-src="include.html" data-refresh="2000" ></span>

    data-refresh="2000" = reload the file after 2 seconds