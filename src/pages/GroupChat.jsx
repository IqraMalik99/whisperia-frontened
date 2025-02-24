
import GroupsCreater from '../components/GroupsCreater'
import ManageGroup from '../components/ManageGroup'

function GroupChat() {
  return (
   <>
   <div className='flex flex-row h-screen'>
   <div className=' bg-purple-200 h-full pt-4 w-3/12'>
     <GroupsCreater/>
    </div>
    <div className="border-l-2 h-full w-1/2 ">
    <ManageGroup/>
  </div>
   </div>
   </>
  )
}

export default GroupChat
