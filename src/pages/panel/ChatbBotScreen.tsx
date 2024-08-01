import React, { useState, useEffect } from 'react';
import '@pages/panel/Panel.css';
import ChatBot, { Flow, Params } from "react-chatbotify";
import { createRagContext,queryRagContext } from "../../../utils/api/index"
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



type ChatBotScreenProps = {
  questions: string[];
  contextId: string;
}



export default function ChatBotScreen({questions, contextId} : ChatBotScreenProps): JSX.Element {



  const [currentTab, setCurrentTab] = useState<CurrentTabStateType>({
    tab: undefined,
    title: undefined,
    url: undefined,
    id: undefined,
    windowId: undefined,
    innerText: undefined
  });


  const flow:Flow = {
    start: {
      message : "Hi, I am Chappi, your webpage assistant. How can I help you?",
      path : "questions",
      transition: {
       duration: 1000,
       interruptable: false
      }
    },
    questions: {
      message : "Here are some questions you can ask me",
      options : questions,
      path : "loop"
    },
    loop: {
      message : async(param : Params) => {
        const result  = await queryRagContext(param.userInput, contextId)
        return result.answer
      },
      path : "loop"
    }
  }


  return (
    <>
      <ChatBot {...{
        settings, 
        styles,
        flow: flow
      }} /></>
  );
}


const settings = {
  "isOpen": true,
  "general": {
    "embedded": true,
    "primaryColor": PRIMARYCOLOR,
    "secondaryColor": SECONDARYCOLOR,
    // "actionDisabledIcon" : "",
    // "fontFamily": "Poppins",
    "showHeader": false,

    "showFooter": true,
  },
  "notification": {
    "disabled": true
  },
  "header": {

    "showAvatar": false,
    "avatar": "https://ik.imagekit.io/egmym9cit/image%201.png?updatedAt=1722344560309",
  },
  "footer": {
    "text": "Powered by GROQ",
  },
  "voice": {
    "disabled": true
  }, "fileAttachment": {
    "accept": "pdf",
    "sendFileName": true,
    "disabled": false
  }, "emoji": {
    "disabled": true
  },
  "chatHistory": { storageKey: "example_basic_form" }


}

const styles = {

  "chatWindowStyle": {
    "width": "100vw",
    "height": "100vh"
  },
  "chatInputAreaStyle": {
    "height": "auto",
    "maxHeight": "100%",
  },
  "chatInputAreaFocusedStyle": {
    "outline": "none",
    "boxShadow": "none"
  },
  "sendButtonStyle": {

    "borderRadius": "100%",
    "width": "40px",
    "height": "40px",
    "padding": "10px",
    "transition": "all 0.1s ease-in-out"

  },
  "sendButtonHoveredStyle": {
    "borderRadius": "100%",
    "width": "40px",
    "height": "40px",
    "padding": "8px",
    "transition": "all 0.1s ease-in-out"
  }
}
