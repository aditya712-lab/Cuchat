import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { IconButton } from '@mui/material';

import { Badge } from '@mui/material';

import { axiosInstance } from '../../config';
import "./profilebar.css"
import { useEffect, useState } from 'react';

const ProfileBar = ({isOpen, socket, ToggleSidebar, user, me, currentUser, conversation, setConversation, friends, setFriends, currentConversation, setCurrentConversation}) => {
    const [disabledDescription, setDescriptionDisabled] = useState(true);
    const [disabledProfile, setProfileDisabled] = useState(true);

    const handleFile = (e) =>{
        e.preventDefault();
        
        let file = e.target.files[0];

        if(file){
            const data = new FormData();
            const filename = file.name;

            console.log(filename);

            data.append("image", file);
            data.append("filename", filename);
            data.append("userId", currentUser?._id);

            console.log(file)
            axiosInstance.post('/users/' + currentUser?._id + '/profile', data);
        }
    }

    const handleProfileSubmit = async () =>{
        if(disabledProfile === true){
            setProfileDisabled(prev => !prev);
        }else{
            setProfileDisabled(prev => !prev);
        }
    }

    const handleDescriptionSubmit = async () =>{
        if(disabledDescription === true){
            setDescriptionDisabled(prev => !prev);
        }else{
            setDescriptionDisabled(prev => !prev);
        }
    }

    const handleUnfriend =async ()=>{
        try{

            setFriends(friends.filter(f=> f != user._id));
            setConversation(conversation.filter(c => c._id !== currentConversation._id));

            const res = await axiosInstance.put("/users/" + user._id + "/unfollow", {userId: currentUser._id});
            const conv_res = await axiosInstance.delete("/conversations/" + currentConversation._id, {userId: currentUser._id});

            socket.current.emit("deleteConversation", {
                receiverId: user._id,
                senderId: currentUser._id,
                conversationId: currentConversation._id
            });

            ToggleSidebar();

        }catch(err){
            console.log(err);
        }
        finally{
            setCurrentConversation(null);
        }
    };

    return (
        <>
            <div className={`profilebar ${isOpen == true ? 'active' : ''} ${me === true ? 'me' : 'other'}`}>
                
                <div className="sd-header">
                    <h4 className="mb-0">Profile</h4>
                    <div className="btn" onClick={ToggleSidebar}><CloseIcon/></div>
                </div>

                <div className='profilebar-profilepic'>
                    <Badge badgeContent={
                            me?
                            <div className="image-upload">
                                <label htmlFor="file-input">
                                    <CameraAltIcon fontSize='large' className='pic-upload-button'/>
                                </label>
        
                                <input id="file-input" type="file" accept="image/png, image/jpeg" onChange={handleFile}/>
                            </div>
                            :''
                    } anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}>
                    <img src={'./profiles/' + (user.profilePicture ? user.profilePicture : "default.jpg")} className='profile-image-big'></img>
                    </Badge>

                </div>
                <div className="sd-body">
                    <form method="post">
                        <div className='user-info'>
                            <ul>
                                <li>Username :</li>
                                {disabledProfile ? 
                                    <input className='name-input' type="text" value={user.username} disabled/>
                                    :<input className='name-input editable' type="text"/>
                                }
                                { me?
                                <div className='edit' onClick={handleProfileSubmit}>
                                    <IconButton>
                                        {disabledProfile ? <EditIcon className='hover-button'/> : <DoneIcon />}
                                    </IconButton>
                                </div>
                                :''}
                                <li><b>UID :</b> {user.uid}</li>
                                <li><b>Joined :</b> {user.createdAt}</li>
                                <li><b>email :</b> {user.email}</li>

                                <hr></hr>

                                <li><h4>Description :</h4></li>
                                {disabledDescription ? 
                                    <textarea className='desc-input' type="text" placeholder={me? "Enter a description":user.desc? user.desc:"No description added by user"} disabled/>
                                    :<textarea className='desc-input editable' type="text" value={user.desc}/>
                                }
                                {me ? <div className='edit' onClick={handleDescriptionSubmit}>
                                    <IconButton>
                                        {disabledDescription ? <EditIcon/> : <DoneIcon/>}
                                    </IconButton>
                                </div>: ''}
                            </ul>
                            
                        </div>
                    </form>
                </div>
                { !me ? 
                <Button variant='primary' onClick={handleUnfriend} className="unfriend-button">
                    Un Friend
                </Button>: ""
                }
            </div>
            <div className={`profilebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </>
    )
}

export default ProfileBar;