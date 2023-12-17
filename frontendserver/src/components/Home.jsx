import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom"
import { usedEmail } from "./Login"
import { usedName } from "./Login"
import Popup from "./Popup";
import GroupChat from "./GroupChat";
import addChatImage from "../addChatButton.png";
import addChatMember from "../addChatMember.png";
import baseURL from "../api/apiKirby";

export function Home() {
  //Information for th elegacy form
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [sender, setSender] = useState('');
  const [score, setScore] = useState('');
  //Booleans to make the popups work
  const [newChatButtonPopup, setNewChatButtonPopup] = useState(false);
  const [newMemberButtonPopup, setNewMemberButtonPopup] = useState(false);
  const [sendSongPopup, setSendSongButtonPopup] = useState(false);
  const [sendGraderPopup, setSendGraderPopup] = useState(false);
  //A way to make pressing a groupchat button do something
  const [selectedGroupchat, setSelectedGroupchat] = useState('Nothing');
  const [selectedConvoID, setSelectedConvoID] = useState('Nothing');
  const [selectedTitleBio, setSelectedTitleBio] = useState('Nothing');
  //Additional info for the new chat popup form
  const [chatTitle, setChatTitle] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  //For the home GET request
  const [homeGET, sethomeGET] = useState({});
  //Additional info for the new member form
  const [nameofNewMember, setNameofNewMember] = useState('');
  const [nameofSong, setNameofSong] = useState('');
  const [nameofArtist, setNameofArtist] = useState('');
  //Additional info for the grader form
  const [rating, setRating] = useState('');
  //getting member info per groupchat
  const [membersGet, setmembersGET] = useState({});
  //chooses to display whether to grade song
  const [gradedButtonVisible, setGradedButtonVisible] = useState(true);
  const [songName, setSongName] = useState('');
  const [currentScore, setCurrentScore] = useState('');
  const [toggleSongButton, setToggleSongButton] = useState(false);
  const [songArtist, setSongArtist] = useState('');
  //archive tings
  const [archivesGet, setArchives] = useState('');
  //songURL
  const [songURL, setSongURL] = useState('');
  //Remove forms stuff
  const [archivesButtonPopUp, setArchivesButtonPopUp] = useState(false);
  const [leaveGroupchatButtonPopUp, setLeaveGroupchatButtonPopUp] = useState(false); //Doesnt need new info
  const [removeMemberButtonPopUp, setRemoveMemberButtonPopUp] = useState(false); //needs nameofRemoveMember
  const [nameofRemoveMember, setNameofRemoveMember] = useState('');

  useEffect(() => {
    console.log("baseURL is " + baseURL.baseURL);
    fetch(`${ baseURL }/home`, {
      method: 'GET' 
    })
    .then(response => response.json())
    .then(data => {
      console.log("baseURL is " + baseURL);
      sethomeGET(data); 
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }, [newChatButtonPopup]);

  const handleLegacyForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, formType: "formLegacy", song: song , artist: artist, sender: sender, score: score, 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedTitleBio: {selectedTitleBio},  
                             usedSelectedGroupchatID: {selectedConvoID},
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "Legacy submission successful") {
            window.alert('Legacy submission successful!');
            console.log('Submission Success');
            getArchives();
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleNewChatForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, formType: "formNewChat", chatTitle: chatTitle , chatDescription: chatDescription, 
                            usedSelectedGroupchat: {selectedGroupchat}, usedSelectedTitleBio: {selectedTitleBio},  usedSelectedGroupchatID: {selectedConvoID}})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "New chat made successfully") {
            window.alert('New chat made successfully!');
            console.log('Submission Success');
        }else{
            console.log('Error');
            window.alert("Chat creation Failed");
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleNewMemberForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formType: "formNewMember", usedSelectedGroupchat: {selectedGroupchat}, 
                            usedSelectedTitleBio: {selectedTitleBio}, nameofNewMember: nameofNewMember, usedSelectedGroupchatID: {selectedConvoID}})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "New member added to chat successfully") {
            window.alert('New member added to chat successfully!');
            console.log('New member added to chat Success');
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleNewSongForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, formType: "formNewSong", song: song , artist: artist, sender: sender, score: score, 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedTitleBio: {selectedTitleBio},  
                             usedSelectedGroupchatID: {selectedConvoID},
                             usedSongName: {nameofSong},
                             usedArtistName: {nameofArtist},
                             usedSongURL: {songURL}
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "New song added to archives successfully") {
            window.alert('New song added to archives successfully');
            console.log('Submission Success');
            getSongStatus();
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleGraderForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, usedNameValue: {usedName}, formType: "formGrader", 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedGroupchatID: {selectedConvoID}, usedRating: {rating},
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "Grading success") {
            window.alert('Grading done!');
            console.log('Grading success');
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleLeavingForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, usedNameValue: {usedName}, formType: "formLeaving", 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedGroupchatID: {selectedConvoID},
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "Leaving success") {
            window.alert('Leaving done!');
            console.log('Leaving success');
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const handleRemoveSongForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, usedNameValue: {usedName}, formType: "formSongRemove", 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedGroupchatID: {selectedConvoID}, 
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "Song removal success") {
            window.alert('Song removal done!');
            console.log('Song removal success');
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };
  
  const handleRemoveMemberForm = (e) => {
    e.preventDefault();

    fetch(`${ baseURL }/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usedEmailValue: {usedEmail}, usedNameValue: {usedName}, formType: "formMemberKick", 
                             usedSelectedGroupchat: {selectedGroupchat}, 
                             usedSelectedGroupchatID: {selectedConvoID}, usedNameofRemoveMember: {nameofRemoveMember}
                             })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Handle the response from the server
        if (data.message === "Kicking success") {
            window.alert('Kicking done!');
            console.log('Kicking success');
        }else{
            console.log('Error');
            window.alert(data.message);
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
  };

  const pullGroupChatName = (data) => {
    setSelectedGroupchat(data); 
    setToggleSongButton(true);
  }

  const pullGroupChatID =  (data) => {
    try {
      setSelectedConvoID(data); 
      console.log("the data ID sent in is: " + data);
    } catch (error) {
      console.error('Error in pullGroupChatID:', error);
    }
  }

  React.useEffect(() => {
    console.log("set the new selected convo id as " + selectedConvoID);
    getNewGroupMembers();
    getSongStatus();
    getArchives();
  }, [selectedConvoID, newMemberButtonPopup, sendGraderPopup]);

  const getNewGroupMembers =  () => {
    console.log("getNewGroupMembers ID: " + selectedConvoID);
    fetch(`${ baseURL }/members?selectedGroupChatID=${selectedConvoID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setmembersGET(data); 
    })
    .catch(error => {
      console.log('Error:', error);
    });
  };

  const getSongStatus = () => {
    console.log("getSongStatus ID: " + selectedConvoID);
    fetch(`${ baseURL }/songStatus?selectedGroupChatID=${selectedConvoID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response); // Check the response structure
      return response.json();
    })
    .then(data => {
      console.log("gets here: " + data.songNotRated);
      //console.log(data);
      setGradedButtonVisible(data.songNotRated); 
      setSongName(data.songName);
      setCurrentScore(data.currentScore);
      setSongArtist(data.songArtist);
      setSongURL(data.currentLink);
    })
    .catch(error => {
      console.log('Error:', error);
    });
  };

  const getArchives = () => {
    console.log("getArchives ID: " + selectedConvoID);
    fetch(`${ baseURL }/archives?selectedGroupChatID=${selectedConvoID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response); // Check the response structure
      return response.json();
    })
    .then(data => {
      console.log(data);
      setArchives(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
  };

  return (
  <div className = "bgcolor font-overlock overflow-y-hidden overflow-x-hidden text-xl h-screen">
    <aside class="center flex">
      <div class="absolute">
        <nav>
          <ul>
            <li class="top-0 right-0 border border-gray-300 hover:border-slate-400 px-5 mt-2 text-white text-xl font-overlock font-bold"><Link to="/login">Log Out</Link></li>
          </ul>
        </nav>
      </div>

      <div class="mt-16 w-[300px] rounded-lg overflow-y-auto featurecolor border-gray-50 border-r border-t border-l border-b">
        <div class="flex justify-center py-8">
          <h2 class="underline px-5 text-lg font-medium text-white text-left">Groupchats</h2>
          <button onClick={() => setNewChatButtonPopup(true)} type="button" class="text-right w-8 h-8" >
            <img src={addChatImage} />
          </button>   
        </div>
          <div class="mt-8 space-y-4">
            {homeGET.chatInfo?.map((groupchats) => (
              <div>
                <GroupChat pullGroupChatName={pullGroupChatName} pullGroupChatID={pullGroupChatID} name={groupchats.conv_name} id={groupchats.conv_id} />
              </div>
              ))}
          </div>
      </div>

      <div>
        <div className = "h-[45vh] mt-16 w-96 rounded-lg flex flex-col items-center py-8 space-y-8 featurecolor border-gray-50 border-r border-t">
          <p class="underline text-m text-white">{"Judgement" }</p> 
          { toggleSongButton ?
          <div>
            {gradedButtonVisible ?
              <button onClick={() => setSendSongButtonPopup(true)} class="border border-gray-300 hover:border-slate-400 px-5 text-lg font-medium text-white" >Send Song</button>
              :<button onClick={() => setSendGraderPopup(true)} class="border border-gray-300 hover:border-slate-400 px-5 text-lg font-medium text-white" >Grade Song</button>
            } 
            <h2 class="text-m text-white" >
              <a href={songURL} target="_blank" > Song: { songName } { songArtist } </a>  
              </h2>
            <h2 class="text-m text-white" >Current Score: { currentScore }</h2>
          </div> : <div></div>
          }
        </div>
        <div className = "h-[45vh] w-96 rounded-lg flex flex-col items-center py-8 space-y-8 featurecolor px-6 text-xl  text-white border-gray-50 border-t border-r border-b">
          <div>
            <button onClick={() => setArchivesButtonPopUp(true)} class = "border border-gray-300 hover:border-slate-400 px-5 text-lg font-medium text-white">Send Legacy Song</button>
          </div>
        </div>
      </div>

      <div class="mt-16 w-[700px] rounded-lg overflow-y-auto height-custom featurecolor border-gray-50 border-r border-b border-t flex flex-col items-center py-8">
        <div>
          <h1 class="underline pb-8 text-lg font-medium text-white" >Archives</h1>
        </div>
        <div>
          {archivesGet.archivesData?.map((archivesGet) => (
            <div class="grid gap-10 grid-cols-4 flex-row items-center justify-center">
              <div>
                <p class="font-medium text-white py-2 flex flex-col items-center text-center" >{archivesGet.song}</p>
              </div>
              <div>
                <p class="font-medium text-white py-2 flex flex-col items-center text-center" >{archivesGet.artist}</p>
              </div>
              <div>
                <p class="font-medium text-white py-2 flex flex-col items-center text-center" >{archivesGet.score}</p>
              </div>
              <div>
                <p class="font-medium text-white py-2 flex flex-col items-center text-center" >{archivesGet.sender}</p>
              </div>           
            </div>             
          ))}
        </div>
      </div>

      <div>
        <div className = "rounded-lg mt-16 w-[250px] h-[80vh] overflow-y-auto flex flex-col items-center py-8 space-y-8 featurecolor border-t border-gray-50 border-r">
          <div class="flex justify-center">
            <h1 class="underline px-5 font-medium text-white" >GroupChat Members</h1>
            <button onClick={() => setNewMemberButtonPopup(true)} type="button" class="w-8 h-8"><img src={addChatMember} /></button>
          </div>
            {membersGet.names?.map((memberName) => (
              <div>
                <p class="font-medium text-white" >{memberName.name}</p>
              </div>
            ))}          
        </div>

        <div className = "rounded-lg featurecolor h-[10vh] px-6 text-xl text-white border-r border-b border-gray-50 flex flex-col justify-center items-center">
          <div>
            <button onClick={() => setRemoveMemberButtonPopUp(true)} class = "border border-gray-300 hover:border-slate-400 px-5 text-lg ml-4 font-medium text-white">Remove Member</button>
          </div>
          <div>
            <button onClick={() => setLeaveGroupchatButtonPopUp(true)} class = "border border-gray-300 hover:border-slate-400 px-5 text-lg ml-4 font-medium text-white">Leave Groupchat</button>
          </div>
        </div>
      </div>
    </aside>

    <div>
      <Popup trigger={newChatButtonPopup} setTrigger = {setNewChatButtonPopup}> 
      <form onSubmit={handleNewChatForm} action="#">
              <div>
                <h2 class="text-md font-medium text-black">Enter information!</h2>
                <div>
                  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                     minLength = "1" maxLength = "30" value={chatTitle} onChange={(e) => setChatTitle(e.target.value)} type="chatTitle" placeholder="Groupchat name" id="chatTitle" name="chatTitle"/>
                  </div>
                  
                  <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                    <button class = "text-md text-black"type="submit">Submit</button>
                  </div>        
                </div>     
              </div>
            </form> 
      </Popup>   
    </div>

    <div>
      <Popup trigger={newMemberButtonPopup} setTrigger = {setNewMemberButtonPopup}> 
      <form onSubmit={handleNewMemberForm} action="#">
              <div>
                <h2 class="text-md font-medium text-black">Enter the users you want to add!</h2>
                <div>
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                     minLength = "1" maxLength = "30" value={nameofNewMember} onChange={(e) => setNameofNewMember(e.target.value)} type="nameofNewMember" placeholder="New member name" id="nameofNewMember" name="nameofNewMember"/>
                  </div>
                 
                  <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                    <button class = "text-md text-black"type="submit" >Submit</button>
                  </div>        
                </div>     
              </div>
            </form> 
      </Popup>   
    </div>
    
    <div>
      <Popup trigger={leaveGroupchatButtonPopUp} setTrigger = {setLeaveGroupchatButtonPopUp}> 
        <form onSubmit={handleLeavingForm} action="#">
          <div>
            <h2 class="text-md font-medium text-black">Are you sure you want to leave: {selectedGroupchat}</h2>            
            <div class="sm:mx-32 sm:w-full sm:max-w-sm">
              <button class = "text-md text-black"type="submit" >Yes</button>
            </div>      
          </div>
        </form>   
      </Popup>   
    </div>   

    <div>
      <Popup trigger={archivesButtonPopUp} setTrigger = {setArchivesButtonPopUp}> 
      <form onSubmit={handleLegacyForm} action="#">
          <div>
           <h2 class="text-md font-medium text-black">Legacy</h2>
            <div>
              <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  minLength = '1' maxLength = "30" value={song} onChange={(e) => setSong(e.target.value)} type="song" placeholder="song" id="song" name="song"/>
              </div>
              
              <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  maxLength = "30" value={artist} onChange={(e) => setArtist(e.target.value)} type="artist" placeholder="artist" id="artist" name="artist"/>
              </div>

              <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  maxLength = "30" value={sender} onChange={(e) => setSender(e.target.value)} type="sender" placeholder="sender" id="sender" name="sender"/>
              </div>

              <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  maxLength = "30" value={score} onChange={(e) => setScore(e.target.value)} type="score" placeholder="score" id="score" name="score"/>
              </div>
                  
              <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                <button class = "text-md text-black"type="submit" >Submit</button>
              </div>        
            </div>     
          </div>
        </form> 
      </Popup>  
    </div>

    <div>
      <Popup trigger={removeMemberButtonPopUp} setTrigger = {setRemoveMemberButtonPopUp}> 
        <form onSubmit={handleRemoveMemberForm} action="#">
          <div>
            <h2 class="text-md font-medium text-black">Remove Member from {selectedGroupchat}</h2>
              <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                 maxLength = "30" value={nameofRemoveMember} onChange={(e) => setNameofRemoveMember(e.target.value)} type="nameofRemoveMember" placeholder="Name " id="nameofRemoveMember" name="nameofRemoveMember"/>
              </div>
            <div class="sm:mx-32 sm:w-full sm:max-w-sm">
              <button class = "text-md text-black"type="submit" >Confirm</button>
            </div>   
          </div>
        </form>   
      </Popup>   
    </div>  

    <div>
      <Popup trigger={sendSongPopup} setTrigger = {setSendSongButtonPopup}> 
      <form onSubmit={handleNewSongForm} action="#">
              <div>
                <h2 class="text-md font-medium text-black">Song:</h2>
                <div>
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                     minLength = "1" maxLength = "30" value={nameofSong} onChange={(e) => setNameofSong(e.target.value)} type="nameofSong" placeholder="Name of Song" id="nameofSong" name="nameofSong"/>
                  </div>
                  <h2 class="text-md font-medium text-black">Artist:</h2>
                  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                     minLength = "1" maxLength = "30" value={nameofArtist} onChange={(e) => setNameofArtist(e.target.value)} type="nameofArtist" placeholder="Name of Artist" id="nameofArtist" name="nameofArtist"/>
                  </div>
                  <h2 class="text-md font-medium text-black">Link:</h2>
                  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                     minLength = "1" maxLength = "100" value={songURL} onChange={(e) => setSongURL(e.target.value)} type="songURL" placeholder="Link to Song" id="songURL" name="songURL"/>
                  </div>

                  <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                    <button class = "text-md text-black"type="submit" >Submit</button>
                  </div>        
                </div>     
              </div>
            </form> 
      </Popup>   
    </div>

    <div>
      <Popup trigger={sendGraderPopup} setTrigger = {setSendGraderPopup}> 
      <form onSubmit={handleGraderForm} action="#">
              <div>
                <div>
                  <h2 class="text-md font-medium text-black">What is your rating?</h2>
                  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-Inter"  
                      value={rating} onChange={(e) => setRating(e.target.value)} type="rating" id="rating" name="rating">
                    <option disabled value="">Select a rating</option>
                    <option value="10">10</option>                    
                    <option value="9.5">9.5</option>
                    <option value="9">9</option>
                    <option value="8.5">8.5</option>
                    <option value="8">8</option>
                    <option value="7.5">7.5</option>
                    <option value="7">7</option>
                    <option value="6.5">6.5</option>
                    <option value="6">6</option>
                    <option value="5.5">5.5</option>
                    <option value="5">5</option>
                    <option value="4.5">4.5</option>
                    <option value="4">4</option>
                    <option value="3.5">3.5</option>
                    <option value="3">3</option>
                    <option value="2.5">2.5</option>
                    <option value="2">2</option>
                    <option value="1.5">1.5</option>
                    <option value="1">1</option>
                    <option value=".5">.5</option>
                    <option value="0">0</option>
                    </select>
                  </div>
                  
                  <div class="sm:mx-32 sm:w-full sm:max-w-sm">
                    <button class = "text-md text-black"type="submit" >Submit</button>
                  </div>        
                </div>     
              </div>
            </form> 
      </Popup>   
    </div>
  </div>
  );
}