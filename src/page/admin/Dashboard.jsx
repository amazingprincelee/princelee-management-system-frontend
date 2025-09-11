import { useEffect } from "react";
import DashboardLayout from "../../component/DashboardLayout";
import { useDispatch} from "react-redux";
import { fetchUserProfile } from "../../redux/features/userSlice";
import StatCard from "../../component/admin/statcard";



function Dashboard(){

 
 const dispatch = useDispatch()

       useEffect(()=>{
         dispatch(fetchUserProfile())
       }, [dispatch])

 
     

    return(
        <>
        <DashboardLayout>
            <StatCard />
        <h1>hi dashboard</h1>
        </DashboardLayout>
        </>
    )
}


export default Dashboard