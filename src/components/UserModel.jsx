
import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { userId } from '../store/reducer.js';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../socket.jsx';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';


function UserModel() {
  let [friends, setFriends] = useState([]);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const socket = useSocket();
  const chatId = useSelector((state) => state.user.chatId);

  useEffect(() => {

    socket.on("REFETCH_CHATS", async() => {
      console.log("entry");
      
      let fetcher = async () => {
        try {
          const response = await axios.get('https://whisperia-backened-production.up.railway.app/chat/get-chat',
            {
              withCredentials: true
            });
          setFriends(response.data);
          console.log(response.data, " my chats");
        } catch (error) {
          console.error("Error fetching data: ", error);
          console.log("Error in data fetching");
        }
      };
      fetcher();
    })

    socket.on("LeftGroup", async ({leftUserName,leftUser}) => {
      console.log(leftUserName);
      console.log(leftUser);
      
      toast.success(`${leftUserName} has left the group`);
    });

    return () => {
      socket.off("REFETCH_CHATS");
      socket.off("LeftGroup");
    };
  }, [socket])

  useEffect(() => {
    let fetcher = async () => {
      try {
        const response = await axios.get('https://whisperia-backened-production.up.railway.app/chat/get-chat', {
          withCredentials: true,
        });
        setFriends(response.data);
        console.log(response.data, " my chats");
      } catch (error) {
        console.error("Error fetching data: ", error);
        console.log("Error in data fetching");
      }
    };
    fetcher();
  }, []);

  let handleLeftGroup= async()=>{
    console.log("Left Group");
    setGroupOpen(false);
    console.log(chatId);
    
    let leftgroup = await axios.get(`https://whisperia-backened-production.up.railway.app/chat/left-chat/${chatId}`, {
      withCredentials: true,
    });
    console.log(leftgroup,"left");
  }

  const [open, setOpen] = useState(false);
  const [groupOpen,setGroupOpen]=useState(false);

  // Handle opening of the dialog
  const handleFocus = (e, id) => {
    console.log(id);
    e.preventDefault();
    setOpen(true);
  };

  // Handle closing of the dialog
  const handleClose = () => {
    setOpen(false);
  };
  
  let handleCloseGroup=()=>{
    setGroupOpen(false);
  }

  let handleGroupFocus = (e, id) => {
    console.log(id);
    
    e.preventDefault();
    setGroupOpen(true);
  }

  let handleDelete = async () => {
    console.log("Done1");
    setOpen(false);
    let deleteChat = await axios.get(`https://whisperia-backened-production.up.railway.app/chat/delete-chat/${chatId}`, {
      withCredentials: true,
    });
    console.log(deleteChat);

  }

  return (
    <div className='mt-20'>
      {friends.map((user) => (
        <div
          key={user._id}
          onClick={() => {
            // Directly use the user._id for dispatching and navigation
            dispatch(userId(user._id));  // Dispatch the correct user id
            navigate(`/chats/${user._id}`);  // Navigate to the specific chat
          }}
          tabIndex="0"
          className="w-5/6 focus:bg-purple-300 bg-purple-100 h-16 rounded-xl m-auto mb-2 px-3"
        >
          <div className="flex items-center h-16 gap-3" onContextMenu={(e) => {
            console.log("Right Clicked");
            if (!user.isGrouped) {
              handleFocus(e, user._id);
            }
            else{
              handleGroupFocus(e,user._id);
            }
          }
          }>
            {user.isGrouped ? (
              <Stack direction="row" spacing={0} sx={{ position: 'relative' }}>
                <Avatar src={user.members[0].avatar} sx={{ marginLeft: '0', marginRight: '-10px' }} />
                <Avatar src={user.members[1].avatar} sx={{ marginLeft: '-10px', marginRight: '-10px' }} />
                <Avatar src={user.members[2].avatar} sx={{ marginLeft: '-10px' }} />
              </Stack>
            ) : (
              <Avatar src={user.members[0].avatar} />
            )}
            <div>
              <p className="font-semibold text-pink-600">{user.name}</p>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "gray" }}>
          <DeleteIcon sx={{ fontSize: 30, color: "gray" }} /> Delete chat
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDelete} sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={groupOpen} onClose={handleCloseGroup}>
        <DialogTitle sx={{ color: "gray" }}>
          <DeleteIcon sx={{ fontSize: 30, color: "gray" }} /> Delete chat
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleLeftGroup} sx={{ color: "red" }}>
            Left Group
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default UserModel;
