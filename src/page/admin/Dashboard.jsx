import { useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import { useDispatch} from "react-redux";
import { fetchUserProfile } from "../../redux/features/userSlice";
import StatCard from "../../component/admin/statcard";
import MainArea from "../../component/admin/main-area";



function Dashboard(){

 
 const dispatch = useDispatch()

       useEffect(()=>{
         dispatch(fetchUserProfile())
       }, [dispatch])

 
     

    return(
        <>
        <DashboardLayout>
            <StatCard />
            <MainArea />
        </DashboardLayout>
        </>
    )
}


export default Dashboard