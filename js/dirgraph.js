var myObject={};
var cy;
var lsnjson="graphdata.json";
var layoutPadding = 50;
var aniDur = 500;
var easing = 'linear';

var cy;
var nodeselected;
var allNodes = null;
var allEles = null;
var lastHighlighted = null;
var lastUnhighlighted = null;
var node;
var jsondata;
var filteredIncomers=[];

function initCytoscape(){
	cy=cytoscape({
		container: document.getElementById("cy"),
		elements:[],
		style: [
		{
			selector: 'node',
			style: {
				shape: 'hexagon',
				'background-color': 'grey',
				label: 'data(title)'
			}
		},
		{
			selector: 'node.faded',
			style: {
				opacity: '0.1'
			}
		},
		{
			selector: 'edge.faded',
			style: {
				opacity: '0.1'
			}
		},
		{
			selector: 'node.highlighted',
			style: {
				opacity: '1',
				'min-zoomed-font-size': 0,
				'z-index': 9999,
				'text-outline-color':'#FFF',
				'text-outline-opacity':1,
				'text-background-padding':5,
				'text-outline-width':5
			}
		},
		{
			selector: 'edge.highlighted',
			style: {
				opacity: '1',
				width: '4',
				'z-index': 9999
			}
		},
		{
			selector: 'edge',
			style: {
				'width': 3,
				'target-arrow-shape': 'triangle',
				'arrow-scale':2,
				'curve-style': 'bezier'
			}
		},
		{
			selector: '.helightstyle',
			style: {
				'line-color': 'blue',
				'background-color': 'blue'
					/*	'text-background-opacity': 1,
						'text-background-color': '#ccc',
						'text-background-shape': 'roundrectangle',
						'text-border-color': '#FFF',
						'text-border-width': 1,
						'text-border-opacity': 1*/

					}
				},
				{
					selector: '.unhelightstyle',
					style: {
						'line-color': 'grey',
						'background-color': 'red',
					}
				}
				,
				{
					selector: '.endnode',
					style: {
						'line-color': 'grey',
						'background-color': 'darkgreen',
					}
				},
				{
					selector: '.nonodes',
					style: {
						'line-color': 'grey',
						'background-color': 'darkblue',
					}
				},
				{
					selector: '.hasnodes',
					style: {
						'line-color': 'grey',
						'background-color': 'red',
					}
				},
				{
					selector:  '.hidden',
					style: {
						display: 'none'
					}
				}
				]
			})

	allNodes = cy.nodes();
	allEles = cy.elements();

	cy.on('select unselect', 'node', function(e){
			document.getElementById("myInput").value="";
			cy.elements().removeClass('faded highlighted nonodes hasnodes');
				node = cy.$('node:selected');
				//console.log("node", node);
				//cy.elements().hide();
				je = cy.$('#'+this.id());
				//console.log("this.id()", this.id());
				//console.log("je", je.data('title'));

				je.classes('hilightstyle')
				//je.show();
				var valedata=je.incomers();
				cy.elements().removeClass('faded highlighted nonodes hasnodes');
				allEles.removeClass('highlighted');
				valedata.addClass('highlighted');
				je.addClass('highlighted');

				if(je.incomers().length>0){
					for(var i=0;i<je.incomers().length;i++){
						if(cy.$('#'+je.incomers()[i].id()).isNode()){
							if(cy.$('#'+je.incomers()[i].id()).incomers().length==0){
								cy.$('#'+je.incomers()[i].id()).addClass('nonodes');
							}else{
								cy.$('#'+je.incomers()[i].id()).addClass('hasnodes');
								
							}
						}
					}
					je.addClass('hasnodes');
				}else{
					je.addClass('nonodes');
				}
				
				
				var others=cy.elements().not(valedata);
				others.addClass('faded');

			}, 100 );
}

var getjsonMarker=$.getJSON(lsnjson, function (data) {
	initCytoscape()
	jsondata=data;
	
	cy.add(data.elements.nodes);
	cy.add(data.elements.edges);
	cy.layout({
		name: 'random'
	}).run();
});
function makeempty(){

}
function myFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	var totalNodes=jsondata.elements.nodes;
	console.log("totalNodes", totalNodes);
	cy.elements().removeClass('faded highlighted nonodes hasnodes');
	if(filter.length>0){
		filteredIncomers=[]
		for (i = 0; i < totalNodes.length; i++) {
			selectedIds=[];
			a=totalNodes[i].data.title;

			if (a.toUpperCase().indexOf(filter) > -1) {
				mynode=cy.$('#'+totalNodes[i].data.id);
				myincomers=mynode.incomers();
				//myoutgoers=mynode.outgoers();
				mynode.addClass('highlighted');
				if(myincomers.length>0){
					mynode.addClass('hasnodes')
					mynode.removeClass('faded nonodes');
				}else{
					mynode.addClass('nonodes')
					mynode.removeClass('faded hasnodes');
				}
				for(var k=0;k<myincomers.length;k++){
					if(myincomers[k].id().indexOf("_") > -1){
						cy.$('#'+myincomers[k].id()).removeClass('faded nonodes hasnodes');	
						cy.$('#'+myincomers[k].id()).addClass('highlighted');
						//cy.$('#'+myincomers[k].id()).addClass('hasnodes');
					/*	cy.$('#'+myincomers[k].source().id()).removeClass('faded');
						cy.$('#'+myincomers[k].source().id()).addClass('highlighted');
						cy.$('#'+myincomers[k].source().id()).addClass('hasnodes');*/
						filteredIncomers.push(myincomers[k].source().id())
					/*	cy.$('#'+myincomers[k].target().id()).removeClass('faded');
						cy.$('#'+myincomers[k].target().id()).addClass('highlighted');
						cy.$('#'+myincomers[k].target().id()).addClass('hasnodes');*/
						filteredIncomers.push(myincomers[k].target().id())
					}				
				}
			} else {
				mynode=cy.$('#'+totalNodes[i].data.id)
				myincomers=mynode.incomers();
				//myoutgoers=mynode.outgoers();
				mynode.addClass('faded');
				mynode.removeClass('highlighted nonodes hasnodes');
				for(var k=0;k<myincomers.length;k++){
						cy.$('#'+myincomers[k].id()).addClass('faded');
						cy.$('#'+myincomers[k].id()).removeClass('highlighted nonodes hasnodes');	
				}

			}

			if (filteredIncomers.length > 0) {
				for(var k=0;k<filteredIncomers.length;k++){
					//cy.$('#'+filteredIncomers[k]).incomers()
					if(cy.$('#'+filteredIncomers[k]).incomers().length>0){
						cy.$('#'+filteredIncomers[k]).removeClass('faded nonodes');
						cy.$('#'+filteredIncomers[k]).addClass('highlighted');
						cy.$('#'+filteredIncomers[k]).addClass('hasnodes');
					}else{
						cy.$('#'+filteredIncomers[k]).removeClass('faded hasnodes');
						cy.$('#'+filteredIncomers[k]).addClass('highlighted');
						cy.$('#'+filteredIncomers[k]).addClass('nonodes');
					}
					
				}
			}
		}
	}else{
		cy.elements().removeClass('faded highlighted nonodes hasnodes');
	}
}