// **-------------------------------Start of declaring constant------------------------------** //
const C_API_ENDPOINT = "http://127.0.0.1:8000/api/";
// **--------------------------------End of declaring constant-------------------------------** //

// **---------------------------Start of declaring Global variables--------------------------** //
var valid    = false;               // Var for orgName validation
var rootName = " ";                // Var to store the rootName
var subInc   = 1;                 // Var to increment the subNodes id in tree structure
var jsonData = [];               // Var to store the jsonData of tree
var nodeId = [];              // Var to store the node id to check the length of children
var nodeDuplicateInd = " ";
var new_node_parent_mapId = " "; 
var new_node_pId = " ";

// Tab Variabls 
var tabPriKey = " ";                     // var for saving the edited basic data details 
var node_type  = " ";                   // var for saving the edited basic data details
var DetailsTabPK = " ";                 // Var for displaying details tab 
var DetailsTabmapid = " ";              // Var for displaying details tab 
var DetailsTabNodeType = " ";           // Var for displaying details tab 
var DetailsInd = " ";

// **----------------------------End of declaring Global variables---------------------------** //


// **-----------------------------------Start of API call------------------------------------** //
function callAPI(urlLink,data)
{
    if (data === null || data === undefined) {
        data = JSON.stringify({ "client": 100 });
        $.ajax({
            async : false,
            type: 'POST',
            global:false,
            url: C_API_ENDPOINT + urlLink,
            dataType :'json',
            data: data,
                success: function(result){
                    response = result;
                },
                error: function(xhr, resp, text) {
                }
        });
    } else {
        data.client = 100
        data = JSON.stringify(data);
        $.ajax({
            async : false,
            type: 'POST',
            global:false,
            url: C_API_ENDPOINT + urlLink,
            dataType :'json',
            data: data,
                success: function(result){
                    response = result;
                },
                error: function(xhr, resp, text) {
                }
        });
    }
    return(response);
};
// **------------------------------------End of API call-------------------------------------** //


// **--------------------------------Start of navBar component-------------------------------** //
// **Start of Edit display button** //
function toggle(){

    if(edit_display.value=="ON"){
        edit_display.value="OFF";
        document.getElementById("orgBtn").disabled = true;
        $("#orgBtn").css("background","#d7d7d7");
        edit_display("off");
    }
    else {
        edit_display.value="ON";
        document.getElementById("orgBtn").disabled = false;
        $("#orgBtn").css("background","white");
        edit_display("on");
    }
    }
   
// **End of Edit display button** //

// **Start of Org create API call** //
function create(){
    var orgname = document.getElementById("orgName").value;
    var orgCreate = {
        "org_name":orgname
    };
    var urlLink = 'org/create';
    var data = callAPI(urlLink, orgCreate)                          
    if (data.error !== undefined ){
    document.getElementById("message").innerHTML= "Organization name already exist" ;
    document.getElementById("message").style.color= "red" ;
    }
    else {
    var updateOrgLst = document.getElementById("org-list");
    var element = document.createElement("option");
    element.text = document.getElementById("orgName").value.toUpperCase();
    updateOrgLst.appendChild(element);
    document.getElementById("message").innerHTML= "Organization created successfully" ;
    document.getElementById("message").style.color = "green";  
    }
}   
// **End of Org create API call** // 

// **Start of validations for org create** //
function orgValid() {
    var orgname = document.getElementById("orgName").value;
    if(orgname === undefined || orgname === ""){
        document.getElementById("orgErrMsg").innerHTML= "Org name cannot be empty." ;
        document.getElementById("orgErrMsg").style.color= "red" ;
    }
    else if(!(orgname.match(/^[_a-zA-Z0-9]*$/))){
        document.getElementById("orgErrMsg").innerHTML= "Org name cannot contain special characters." ;
        document.getElementById("orgErrMsg").style.color= "red" ;
    }
    else if(orgname.length > 0){
        if(orgname[0].match(/^[_]*$/)){
            document.getElementById("orgErrMsg").innerHTML= "Org name cannot begin with an underscore." ;
            document.getElementById("orgErrMsg").style.color= "red" ;
        }
        else if(orgname[0].match(/^[0-9]*$/)){
            document.getElementById("orgErrMsg").innerHTML= "Org name cannot begin with a number." ;
            document.getElementById("orgErrMsg").style.color= "red" ;
        }
        else if (orgname.length < 3) {
            document.getElementById("orgErrMsg").innerHTML= "Org name must contain atleast three characters." ;
            document.getElementById("orgErrMsg").style.color = "red";
        }
        else {
            valid = true;
            
        }
    }
}
// **End of validations for org create** //

// **Start of navbar datalist function** //
var orgs = " ";
function navDataLst() {
    var orgGetUrl = 'org/getall';
    orgs = callAPI(orgGetUrl,null);
    var out = ' ';
    for(var i=0; i<orgs.length; i++){
        out += orgs[i].fields.name+'<br>';
        var optElement = document.createElement('option');
        optElement.text = orgs[i].fields.name;
        optElement.value = orgs[i].fields.name;
       document.getElementById("org-list").appendChild(optElement);
    }

}
// **End of navbar datalist function** //

// **Start of getting org details from dropdown to left-panel** //

function onInput() {
    rootName = "";
    document.getElementById("root-node").innerHTML = "";
    var val = document.getElementById("getOrg").value;
    document.getElementById("getOrg").value = "";
    // $(".left-panel").empty();
    var opts = document.getElementById('org-list').childNodes;
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].value === val) {
        var spanElement = document.createElement("span");
        spanElement.id = "rootNode";
        spanElement.className = "treeOptions"
        document.getElementById("root-node").append(spanElement);
            var iElement = document.createElement('i');
                iElement.id = "rootNodeId";
                iElement.className = "fa fa-caret-right caret";
                iElement.style.fontSize = "18px";
                document.getElementById(spanElement.id).appendChild(iElement);
            var icon = document.createElement('i')
                icon.className = "fa fa-sitemap treeIcon";
            document.getElementById(spanElement.id).appendChild(icon);
            document.getElementById(spanElement.id).append(opts[i].value);
        rootName = opts[i].value;
        }
    }
}
// **End of getting org details from dropdown to left-panel** //
// **---------------------------------End of navBar component--------------------------------** //


// **------------------------Start of tree structure tree view class-------------------------** //


//** Getting Guid using MapId **//

function NodeGuidByMapId(jsonData, NodeMap)
{
    for(var i=0; i<jsonData.length; i++ ){
        if (NodeMap == jsonData[i].fields.map_id){
            return jsonData[i].pk;
        }
    }
}

// **Start of getting a node refernce of the organization** // 

function rootRef(jsonData, nodeName){
    for(var i=0; i<jsonData.length; i++ ){
        if (nodeName == jsonData[i].fields.name){
            return jsonData[i].fields.root_node;
        }
    }
}
// **End of getting a node refernce of the organization** // 

// **Start of getting a node refernce of the node** // 
function getNodeRef(jsonData, nodeName){
    for(var i=0; i<jsonData.length; i++ ){
        if (nodeName == jsonData[i].fields.map_id){
            return jsonData[i].pk;
        }
    }
}
// **End of getting a node refernce of the node** // 

// **Start of getting a nodeType by nodeId** //
function getNodeType(node){
    data = nodeTypes;
    for(var i=0; i<data.length; i++ ){
        if (node == data[i].pk){
            return data[i].fields.node_type;
        }
    }
}
// **End of getting a nodeType by nodeId** //

// **Start of getting a icon depending on the node type** //
function setNodeType(nodeType){
    var nodeIcon = " ";
    var x = nodeType;
        switch (x) {
            case 3:
            nodeIcon = "fa fa-building treeIcon";
                break;
            case 4:
            nodeIcon = "fa fa-industry treeIcon";
                break;
            case 5:
            nodeIcon = "fa fa-users treeIcon";
                break;
            case 6:
            nodeIcon = "fa fa-square treeIcon";
            break;
        default:
        break;
       }
    return nodeIcon;
}
// **End of getting a icon depending on the node type** //    

// **Start of getting a subsequent children to a tree structure** //
function getChild(pk, listId)
{
    var urlLink1 = 'node/getchilds';
    var nodeGet = {
    "guid" : pk
    };
    var dataj = callAPI(urlLink1, nodeGet);
    
    for (var k=0; k < jsonData.length; k++)
    {
        if (dataj[0].pk == jsonData[k].pk){
            nodeDuplicateInd = "X";
            break;
        }
     }

    if (dataj.error === undefined && nodeDuplicateInd != 'X')  {
        var ul = document.createElement("ul");
        ul.id = "subnode" + subInc;
        ul.setAttribute("value", dataj.length);
        subInc++;
        
        document.getElementById(listId).appendChild(ul);
        for(var i=0; i<dataj.length; i++)
        {

            var lis = document.createElement('li')
            var liId = dataj[i].fields.name  + i;
            lis.id = liId;
            lis.setAttribute('value', dataj[i].fields.map_id)
            lis.setAttribute('class', 'expand')
            document.getElementById(ul.id).appendChild(lis);

            var idiv = document.createElement('div');
                idiv.id =  dataj[i].fields.map_id;
                document.getElementById(liId).appendChild(idiv);

            var iElement = document.createElement('i');
                iElement.setAttribute('value', dataj[i].fields.map_id)
                iElement.id = liId + "i";
                iElement.className = "fa fa-caret-right caret";
                iElement.style.fontSize="18px"
                document.getElementById(liId).appendChild(iElement);

            var icon = document.createElement('i')
                icon.className = setNodeType(dataj[i].fields.node_type);
                document.getElementById(liId).appendChild(icon);

            var li = document.createElement("span");
                li.setAttribute('id',"child"+i);
                li.setAttribute('class','treeOptions');
                var liData =dataj[i].fields.name + " ";
                li.innerHTML = liData;
                document.getElementById(liId).appendChild(li);
                
            // var mapId = document.createElement("span")
            // mapId.className = "sapn1";
            // mapId.innerHTML = dataj[i].fields.mapId;
            // mapId.style.cssFloat = "right";
            // li.appendChild(mapId);
            var json_child = { model: dataj[i].model, pk: dataj[i].pk, fields: dataj[i].fields };
            if (jsonData.includes(json_child) === false){
                jsonData.push(json_child);
            }
            nodeDuplicateInd = " ";
            
        }
    }
    else{

        var rlist = document.getElementById($(this)[0].parent.childId).getElementsByTagName('ul')[0].id;
       var ilist = document.getElementById(rlist).getElementsByTagName("li");

            for(var i=0; i<ilist.length; i++){
                display = ilist[i].style.display
                $(ilist[i]).toggle();
            }
            nodeDuplicateInd = " ";
        }
}
// **End of getting a subsequent children to a tree structure** //
// **-------------------------End of tree structure tree view class--------------------------** //


// **-------------------------------------Start of Tabs--------------------------------------** //

//Function that opens tab on the click of it.
function openTab(evt, tabs) 
{
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabs).style.display = "block";
      evt.currentTarget.className += " active";
      console.log(DetailsInd);
      if (tabs == "Details" && DetailsInd == 1)
      {
           fun_node_type(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid);
           DetailsInd = 0;
      }
      
}

//Edit and display functionality for tabs
function  edit_display(edit_display)
{
    if (edit_display == "on")
    {
        $(".toggle").css("background","white");
        $(".toggle").prop("readonly", false);
    }
    else
    {
        $(".toggle").prop("readonly", true);
        $(".toggle").css("background","#d7d7d7");
        document.getElementById("tab_save").style.visibility = "hidden";
        document.getElementById("tab_cancel").style.visibility = "hidden";
    }
}

    //**//    Start of Basic Data Tab    //**//
function BasicData_details(tabPriKey,node_type)
{
       let basic_data_input = {
           "pk" : tabPriKey,
           "node_type" : node_type
           };          
        let basic_data_url = "basic-data/get";
        let node_basic_data = callAPI(basic_data_url, basic_data_input);
        document.getElementById("BDname").value =node_basic_data[0].fields.name;
        console.log(node_basic_data[0].fields.node_type);
        let primary_key = node_basic_data[0].pk;
        let map_id = node_basic_data[0].fields.map_id;
        let nodeType = node_basic_data[0].fields.node_type;
        document.getElementById("BDNodeType").value = node_type_fun(nodeType);
        document.getElementById("BDMapId").value = map_id;

        // Assigning data for details tab
        DetailsTabPK = " ";                 // Var for displaying details tab 
        DetailsTabmapid = " ";              // Var for displaying details tab 
        DetailsTabNodeType = " "; 
    
        DetailsTabPK = node_basic_data[0].pk;
        DetailsTabmapid = node_basic_data[0].fields.map_id;
        DetailsTabNodeType = node_basic_data[0].fields.node_type;
   }

//Function to get node id description
function node_type_fun(node)
{
data = nodeTypes;
    for(let i=0; i<data.length; i++ )
    {
        if (node == data[i].pk)
        {
        return data[i].fields.description;
        break;
        }
    }
}
    
//Finding the guid based on the map ID
function nodeRefNodeType(jsonData, nodeMapId)
{
    for(let i=0; i<jsonData.length; i++ )
    {
        if (nodeMapId == jsonData[i].fields.map_id)
        {
        return jsonData[i].fields.node_type;
        break;
        }
    }
}

//Function to save the basic data details
function basic_tab_edit(tabPriKey,basic_new_name)
{
    let data = {
                "pk" : tabPriKey,
                "name" : basic_new_name
                }
    let basicedit_url = "basic-data/edit";
    var save_basic_tab = callAPI(basicedit_url,data);
    console.log(save_basic_tab)
}

    //**//    End of Basic Data Tab    //**//

    //**//    Start of Details Data Tab    //**//

    //calling design functions based on the node type
   
    function fun_node_type(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid)
    {
    $("#Details").empty();
     let x = DetailsTabNodeType;
        switch (x) {
            case 3:
                Design_cc(); 
                Details_Tab(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid);
                break;
            case 4:
                Design_POrg(); 
                Details_Tab(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid);
                break;
            case 5:
                Design_PGrp(); 
                Details_Tab(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid);
                break;
            default:
            break;
       }
    }

    // Designing Company Details Page     
function Design_cc() {

    var par1 = document.createElement('p')
    par1.id = "par1";
    document.getElementById("Details").appendChild(par1);

    var element2 = document.createElement('div');
        element2.className = "basicData_align ";
        element2.innerHTML = "Name1 :"
        document.getElementById("par1").appendChild(element2);
    var element1 = document.createElement('input');
        element1.type = "text";
        element1.className = "toggle nonEditable";
        element1.id = "cc_name1"
        element1.readOnly = true;
        document.getElementById("par1").appendChild(element1);
    
    var par2 = document.createElement('p')
    par2.id = "par2";
    document.getElementById("Details").appendChild(par2);

    var element3 = document.createElement('div');
        element3.className = "basicData_align ";
        element3.innerHTML = "Name2 :"
        document.getElementById("par2").appendChild(element3);
    var element4 = document.createElement('input');
        element4.type = "text";
        element4.className = "toggle nonEditable";
        element4.id = "cc_name2"
        element4.readOnly = true;
        document.getElementById("par2").appendChild(element4);
 
    }

    // Designing CPurchase Org Details Page     
    function Design_POrg() {
    var element2 = document.createElement('div');
        element2.className = "basicData_align ";
        element2.innerHTML = "Description :"
        document.getElementById("Details").appendChild(element2);
    var element1 = document.createElement('input');
        element1.type = "text"
        element1.id = "POrg_desc"
        element1.size = "35"
        element1.readOnly = true;
        element1.className = "toggle nonEditable";
        document.getElementById("Details").appendChild(element1);
    }

    // Designing Purchase Group Details Page     
    function Design_PGrp() {
        var element2 = document.createElement('div');
        element2.className = "basicData_align ";
        element2.innerHTML = "Description :"
        document.getElementById("Details").appendChild(element2);
    var element1 = document.createElement('input');
        element1.type = "text"
        element1.id = "Pgrp_desc"
        element1.size = "35"
        element1.readOnly = true;
        element1.className = "toggle nonEditable";
        document.getElementById("Details").appendChild(element1);
       }
       
//Details Tab fuctions with get 
function Details_Tab(DetailsTabPK, DetailsTabNodeType, DetailsTabmapid)
{
    var details_input = {
        "pk" : DetailsTabPK,
        "node_type" : DetailsTabNodeType,
        "company_id" : DetailsTabmapid
    }
    var details_link = "details/get"
    var details_data = callAPI(details_link, details_input);
    var x = DetailsTabNodeType;
    switch (x) {
        case 3:
            document.getElementById("cc_name1").value = details_data[0].fields.name1;
            document.getElementById("cc_name2").value = details_data[0].fields.name2;
            break;
        case 4:
            document.getElementById("POrg_desc").value = details_data[0].fields.description;
            break;
        case 5:
            document.getElementById("Pgrp_desc").value = details_data[0].fields.description;
            break;
        default:
        break;
   }

}


    
    //**//    End of Details Data Tab    //**// 

// **---------------------------------------End of Tabs--------------------------------------** //


function modalfun(modal)
{
   var modal = modal;
            if(valid===false){
                if(modal==="modalTwo"){
                    document.getElementById(modal).style.display = "none";
                }
                else{
                    document.getElementById(modal).style.display = "block";
                }   
            }
            else if(modal === "modalThree"){
                    create();
                    document.getElementById(modal).style.display = "block";
                    var modal = btn.closest('.modal');
                    modal
                    .style.display = "none";
            }
            else if(valid===true){
                if(modal==="modalTwo"){
                    document.getElementById(modal).style.display = "block";
                    var modal = btn.closest('.modal');
                    modal.style.display = "none";
                }
                else{
                    document.getElementById(modal).style.display = "block";
                    // Refresh of variable valid
                    valid = false;
                    document.getElementById("orgName").value = '';
                    document.getElementById("orgErrMsg").innerHTML ='';
                    var modal = btn.closest('.modal');
                    modal.style.display = "none";
                }

            }
            else{
                document.getElementById(modal).style.display = "block"; 
                var modal = btn.closest('.modal');
                modal.style.display = "none";
            }
}