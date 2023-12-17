import React, { useState } from "react"; 
 

export function GroupChat(props) {

  return (
    <div>
      <button class="px-5 text-lg font-medium text-white" onClick={(e) => { props.pullGroupChatName(props.name); props.pullGroupChatID(props.id); }}>
          {props.name}
      </button>
    </div>

  );
}

export default GroupChat;