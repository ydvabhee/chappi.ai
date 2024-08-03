import React , { useState, useEffect } from 'react';
import '@pages/panel/Panel.css';
import { createRagContext } from "../../../utils/api/index"
import ChatBotScreen from './ChatbBotScreen';
import { PacmanLoader } from 'react-spinners';





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


const [questions, setQuestions] = useState<any[]>([]);
const [contextId, setContextId] = useState<string | undefined>(undefined);
const [isError, setIsError] = useState(false);
const [isLoading, setIsLoading] = useState(false);




	async function getCurrentTab() {
		try {
			let queryOptions = { active: true, lastFocusedWindow: true };
			let [tab] = await chrome.tabs.query(queryOptions);
			return tab;
		}  catch (error) {
			setIsError(true)
			console.error(error)
		}
  }


	
function get_document_body() {
  return document.body.innerText
}

const getTabBodyInnerText = async(tab: chrome.tabs.Tab) => {

	if(!tab?.id) return 

	const	injectionResults = await chrome.scripting.executeScript({
		target : {tabId : tab?.id},
		func : get_document_body,
	})
	return injectionResults
}

const getCurrentTabData = async() => {
	try {
		const tab = await getCurrentTab();
		// console.log("title >> ", tab?.title)
		// console.log("url >> ", tab?.url)
		// console.log("id >> ", tab?.id)
		// console.log("windowId >> ", tab?.windowId)

		if(tab?.id){
		const	injectionResults = await getTabBodyInnerText(tab)
		
		if (injectionResults !== undefined) {
			for (const {result} of injectionResults) {
        console.log(` result:`, result);
				setCurrentTab({
					tab: tab?.id,
					title: tab?.title,
					url: tab?.url,
					id: tab?.id,
					windowId: tab?.windowId,
					innerText: result
				})	
			
			}
		}
		}
	} catch (error) {
		setIsError(true)
		console.info(error) }
}


	const createContext = async() => {
		try {

			setIsLoading(true)
			if(!currentTab.innerText) {
				new Error("No content to create context")
				return
			}
			const result = await createRagContext(currentTab.innerText);
			setQuestions(result.questions)
			setContextId(result.id)
		 
			setIsLoading(false)
		} catch (error) {
			setIsError(true)
			setIsLoading(false)
			console.error(error)
		}
	}


	const getAndUpdateContextData = async(tab: chrome.tabs.Tab) => { 
		try {
			const	injectionResults = await getTabBodyInnerText(tab)
			if (injectionResults !== undefined) {
				for (const {result} of injectionResults) {
					// console.log(`Frame ${frameId} result:`, result);
					console.log("currentTab context data >> ",result)
				
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => { 

		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
			try {
				if (changeInfo.status === 'complete' && tab.active) {
					// console.log('Tab URL changed or reloaded:', tab.url);
					// Perform actions based on the new tab content
					// get context data from selected tab only
					if(tab.id === currentTab.id)
					{getAndUpdateContextData(tab)}
				}
			} catch(e) {
				console.error(e)
			}
			
		});

		getCurrentTabData()

	},[])


	useEffect(() => { 
		createContext()
	},[currentTab.innerText])


	 

	if(isError){
		return (
			<>
				<div className='flex flex-col justify-center h-screen items-center p-5'>
					<h1 className='text-9xl font-bold'>404</h1>
					<h2 className='text-2xl font-bold'>NO CONTEXT DATA</h2>
					 
					<div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
  				<p className="text-gray-700">
    <strong>Note : </strong> 
     Please ensure to open this extension in a tab where there is relevant data available. This will allow the extension to create the necessary context.
  </p>
</div>

				</div>
			</>
		)
	}

	if(isLoading){
		return (
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
				<div>

			<PacmanLoader  color='#026496' />
				</div>
			</div>
		)
	}

  return (
     <>
		 <ChatBotScreen questions={questions} contextId={ contextId ? contextId : ''}/>
		 </>
  );
}
