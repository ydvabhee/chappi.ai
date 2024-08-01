import React , { useState, useEffect } from 'react';
import '@pages/panel/Panel.css';
import ChatBot from "react-chatbotify";
import { createRagContext } from "../../../utils/api/index"
import Options from '../options/Options';


const PRIMARYCOLOR = "#026496"
const SECONDARYCOLOR = "#026496"



type CurrentTabStateType = {
	tab: number | undefined;
	title: string | undefined;
	url: string | undefined;
	id: number | undefined;
	windowId: number | undefined;
	innerText: string | undefined;
}


 


export default function Panel(): JSX.Element {
 
const [currentTab, setCurrentTab] = useState<CurrentTabStateType>({
	tab: undefined,
	title: undefined,
	url: undefined,
	id: undefined,
	windowId: undefined,
	innerText: undefined
});

const [form, setForm] = React.useState<any>({});
const [flowState, setFlowState] = React.useState<any>({});
	const formStyle = {
		marginTop: 10,
		marginLeft: 20,
		border: "1px solid #491d8d",
		padding: 10,
		borderRadius: 5,
		maxWidth: 300
	}

	async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }


	
function get_document() {

  return document.body.innerText
}
	useEffect(() => {
		getCurrentTab().then((tab) => {
			console.log("title >> ", tab?.title)
			console.log("url >> ", tab?.url)
			console.log("id >> ", tab?.id)
			console.log("windowId >> ", tab?.windowId)

			if(tab?.id){
			
				chrome.scripting.executeScript({
      target : {tabId : tab?.id},
      func : get_document,
    })
    .then(injectionResults => {
			// console.log("injectionResults >> ", injectionResults);
      for (const {frameId, result} of injectionResults) {
        // console.log(`Frame ${frameId} result:`, result);
				setCurrentTab({
					tab: tab?.id,
					title: tab?.title,
					url: tab?.url,
					id: tab?.id,
					windowId: tab?.windowId,
					innerText: result
				})	

				setFlowState({
					...flowState,
					start: {
						message: "Hi I am Chappi, How may I help you?",
						options : async() => {
							const resp = await createRagContext(result)
							return resp.questions
						},
						path: "loop"
					},
					loop: {
						path: "loop",
						message: "How may I help you?",

					}
				})
      }
		}); }}).catch((error: any) => console.error(error));

	}, [])



	const createContext = async () => {
		if(currentTab.innerText){
			console.log("tetx >> ", currentTab.innerText)
			const result = await createRagContext(currentTab.innerText)
			console.log("result >> ", result)
		}}

	useEffect(() => {
		
		// createContext()
	},[currentTab.innerText])



  return (
     <>
		 <ChatBot {...{
			"settings" : {
				"isOpen" : true,
				"general" : {
					"embedded": true,
					"primaryColor":PRIMARYCOLOR,
					"secondaryColor":SECONDARYCOLOR,
					// "actionDisabledIcon" : "",
					"fontFamily": "Poppins",
					showHeader: false,
					 
					"showFooter": true,
				},
				"notification" : {
					"disabled" : true
				},
				"header" : {
					"title" : "Context : " + currentTab?.title,
					"showAvatar": false,
					"avatar" : "https://ik.imagekit.io/egmym9cit/image%201.png?updatedAt=1722344560309",
				}, 
				"footer" : {
					"text" : "Powered by GROQ",
				},
				"voice" : {
					disabled: true
				}, "fileAttachment" : {
					"accept" : "pdf",
					"sendFileName" : true,
					"disabled" : false
				}, "emoji" : {
					"disabled" : true
				},
				chatHistory: {storageKey: "example_basic_form"}

			},
			"styles":{

				 "chatWindowStyle": {
					"width" : "100vw",
					"height" :"100vh"
				 },
				 "chatInputAreaStyle" : {
					"height" : "auto",
					"maxHeight" : "100%",  
				 },
				 "chatInputAreaFocusedStyle" : {
					"outline" : "none",
					"boxShadow" : "none"
				 }, 
				 "sendButtonStyle" : {
			
					"borderRadius" : "100%",
					"width" : "40px",
					"height" : "40px",
					"padding" : "10px",
					"transition": "all 0.1s ease-in-out"

				 },
				 "sendButtonHoveredStyle":{
					"borderRadius" : "100%",
					"width" : "40px",
					"height" : "40px",
					"padding" : "8px",
					"transition": "all 0.1s ease-in-out"
				 }
			},
			
			flow: flowState
		}} /></>
  );
}
