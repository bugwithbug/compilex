var exec  = require('child_process').exec;
var fs = require('fs');
var cuid = require('cuid');

exports.stats = false;

exports.init = function(option){
	if(option)
	{
		if(option.stats === true )
		{
			console.log('Statistics for compilex is On'.green);		
			exports.stats = true;			
		}
    }	
	fs.exists( './temp' , function(exists){		
		    if(!exists)
		    {
		        if(exports.stats)
		        {
		        	console.log('INFO: '.cyan + 'temp directory created for storing temporary files.'.cyan )
		        }		    	
		    	fs.mkdirSync('./temp');
		    }
	});
}

exports.compileCPP = function ( envData ,  code , fn ) { 
			//creating source file
	        var filename = cuid.slug();
			path = './temp/';
			 			 

			//create temp0 
 			fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){			
				if(exports.stats)
				{
					if(err)
					console.log('ERROR: '.red + err);
				    else
				    console.log('INFO: '.green + filename +'.cpp created');	
				}
			});

 			//compiling and exrcuiting source code
	       if(envData.OS === 'windows' || envData.cmd === 'g++')
	       {

			//compile c code 
			commmand = 'g++ ' + path + filename +'.cpp -o '+path + filename +'.exe' ;
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
					}
					var out = { error : stderr };
					fn(out);
				}
				else
				{
				    var tempcommand = "cd temp & "+ filename ;
					exec( tempcommand , function ( error , stdout , stderr ){
						if(error)
						{
						if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while executing');
							}

						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
								fn(out);								
							}
						else
							{
								var out = { error : stderr };
								fn(out);								
							}													
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
		    		});
				}			

			});


	       }  
	       else 
	       {
			//compile c code 
			commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename+'.out' ;
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
					}
					var out = { error : stderr};
					fn(out);
				}
				else
				{
					exec( path + filename + '.out', function ( error , stdout , stderr ){
						if(error)
						{
						if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while executing');
							}
						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
								fn(out);
							}
						else
							{
								var out = { error : stderr };
								fn(out);
							}													
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
		    		});

				}			
			});
	       }	    								
} //end of compileCPP

exports.compileCPPWithInput = function ( envData , code , input ,  fn ) { 
	var filename = cuid.slug();
	path = './temp/';
	 			 
	//create temp0 
 	fs.writeFile( path  +  filename +'.cpp' , code  , function(err ){
 		if(exports.stats)
	    {
			if(err)
			console.log('ERROR: '.red + err);
	    	else
	    	console.log('INFO: '.green + filename +'.cpp created');
		} 
	});

	if(envData.OS === 'windows' || envData.cmd ==='g++')
	    {	    	    

			//compile c code 
			commmand = 'g++ ' + path + filename +'.cpp -o '+ path + filename+'.exe' ;
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
					}
					var out = { error : stderr };
					fn(out);
				}
				else
				{
					if(input){
						var inputfile = filename + 'input.txt';

						fs.writeFile( path  +  inputfile , input  , function(err ){
							if(exports.stats)
							{
								if(err)
									console.log('ERROR: '.red + err);
			    				else
			    					console.log('INFO: '.green + inputfile +' (inputfile) created');
			    			}
			            });
			            var tempcommand = "cd temp & " + filename ;

						exec( tempcommand + '<' + inputfile , function( error , stdout , stderr ){
						if(error)
						{
						if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while executing');
							}

						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
								fn(out);
							}
						else
							{
								var out = { error : stderr};
								fn(out);
							}																				
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
						});

					}
					else //input not provided 
					{
						if(exports.stats)
						{
							console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
						}
					    var out = { error : 'Input Missing' };
						fn(out);
					}
					
				}
			

			});
	    								
	    }
	else	    	
	    {
	    				//compile c code 
			commmand = 'gcc ' + path + filename +'.cpp -o '+ path + filename+'.out' ;
			exec(commmand , function ( error , stdout , stderr ){  
				if(error)
				{
					if(exports.stats)
					{
						console.log('INFO: '.green + filename + '.cpp contained an error while compiling');
					}
					var out = { error : stderr};
					fn(out);
				}
				else
				{
					if(input){
						var inputfile = filename + 'input.txt';

						fs.writeFile( path  +  inputfile , input  , function(err ){
							if(exports.stats)
							{
								if(err)
									console.log('ERROR: '.red + err);
			    				else
			    					console.log('INFO: '.green + inputfile +' (inputfile) created');
			    			}
			            });

						exec( path + filename +'.out' + ' < ' + path + inputfile , function( error , stdout , stderr ){
						if(error)
						{
						if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp contained an error while executing');
							}

						if(error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1)
							{
								var out = { error : 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.'};
								fn(out);
							}
						else
							{
								var out =  { output : stderr};
								fn(out);
							}																				
						}
						else
						{
							if(exports.stats)
							{
								console.log('INFO: '.green + filename + '.cpp successfully compiled and executed !');
							}
							var out = { output : stdout};
							fn(out);
						}
						});

					}
					else //no input file
					{
						if(exports.stats)
						{
							console.log('INFO: '.green + 'Input mission for '+filename +'.cpp');
						}
					    var out = { error : 'Input Missing' };
						fn(out);
					}
					
				}
				
	
			});


	    }								
} //end of compileCPPWithInput

exports.flushSync = function() {
	    path = '	./temp/';
	    fs.readdir(path, function(err , files){ 
	    	if(!err)
	    	{
	    		for( var i = 0 ; i<files.length ; i++ )
	    		{
	    			
	    			fs.unlinkSync(path+files[i]);	    			

	    		}
	    	}
	    });
}

exports.flush = function(fn) {
	    path = './temp/';
	    fs.readdir(path, function(err , files){ 
	    	if(!err)
	    	{
	    		for( var i = 0 ; i<files.length ; i++ )
	    		{
	    			
	    			fs.unlinkSync(path+files[i]);	    			

	    		}
	    	}
	    });
	    fn();	    
}

