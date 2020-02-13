// **Add Node Functionality** // 
function AddNode()
{   
    let new_node_name = document.getElementById("AddNodeName").value;
    let new_node_MapId = document.getElementById("AddNodeMapId").value;
   
    if (new_node_name === undefined || new_node_name === "")
    {
        // alert("Please Enter the  Node Name");
        document.getElementById("NodeErrMsg").innerHTML= "Node name cannot be empty." ;
        document.getElementById("NodeErrMsg").style.color= "red" ;
    }
    else if (new_node_MapId === undefined || new_node_MapId === "")
    {
        // alert("Please Enter the  Node MapId");
        document.getElementById("NodeErrMsg").innerHTML= "Node MapId cannot be empty." ;
        document.getElementById("NodeErrMsg").style.color= "red" ;
    }
    else
    {
        document.getElementById("firstSector").style.display = "none";
        document.getElementById("ConfirmationPopUp").style.display = "block";
           
    }
}

// Action to be performed on click of NO //
function funAddNodeNo()
{
    document.getElementById("ConfirmationPopUp").style.display = "none";
    document.getElementById("firstSector").style.display = "block";
}

// Action to be performed on click of YES //
function funAddNodeYes()
{
    let new_node_parent = new_node_parent_mapId;  
    let parent_pk = NodeGuidByMapId(jsonData,new_node_parent);
    let new_node_name = document.getElementById("AddNodeName").value;
    let new_node_MapId = document.getElementById("AddNodeMapId").value;
    let sel = document.getElementById('NodeTypesoptions');
    let opt_selected = sel.options[sel.selectedIndex];

      /* Calling ApI of Add Node */
        let urlLinkAddNode = 'node/create';
        let  addNodeInput ={
            "name": new_node_name,
            "node_type": opt_selected.value,
            "parent_node": parent_pk,
            "map_id": new_node_MapId
            };

        var AddNodeResult = callAPI(urlLinkAddNode, addNodeInput);
    //     console.log(AddNodeResult);
    //    console.log(typeof AddNodeResult);
        var nodeResult = typeof(AddNodeResult);
        console.log(nodeResult)
    if ( nodeResult != "object")
    {
        let AddResult = document.getElementById("AddNodeRes")
        AddResult.innerHTML = "Node Added Successfully";
        AddResult.style.color = "green";

        document.getElementById("ConfirmationPopUp").style.display = "none";
         document.getElementById("addNodeFinal").style.display = "block";
    } 
    else{
        let AddResult = document.getElementById("AddNodeRes")
        AddResult.innerHTML = "Node type " + opt_selected.text +" cannot be added under " + new_node_pId ;
        new_node_pId = " ";
        AddResult.style.color = "red";

        document.getElementById("ConfirmationPopUp").style.display = "none";
         document.getElementById("addNodeFinal").style.display = "block";
    }   
    
}

// Refresh of model on completion of the cycle //
function refreshAddNode()
{
    document.getElementById("AddNodeName").value = " ";
    document.getElementById("AddNodeMapId").value = " ";
    document.getElementById("addNodeFinal").style.display = "none";
    document.getElementById("firstSector").style.display = "block";
}

