import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar.jsx'
import FinalResult from '../components/FinalResult.jsx'


function Notes() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userData } = useSelector((state) => state.user)
    const credits = userData?.credits ?? 0;
    const [result, setResult] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState("")

    // Update credits in Redux when generation is successful
    React.useEffect(() => {
        if (result?.creditsLeft !== undefined && userData) {
            dispatch(setUserData({
                ...userData,
                credits: result.creditsLeft
            }));
        }
    }, [result]);


    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6'>
            <motion.header
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className=" mt-6 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex justify-between items-center"
            >
                <div onClick={() => { navigate("/") }} className='cursor-pointer'>
                    <h1
                        className="text-2xl font-bold bg-linear-to-r from-white
                             via-gray-300 to-white bg-clip-text text-transparent"
                    >
                        ExamNotes AI
                    </h1>
                    <p className="text-white text-sm mt-1">
                        AI-powered exam-oriented notes & revision
                    </p>
                </div>
                <div className='flex items-center gap-4'>
                    <button className='flex items-center gap-2
                    px-4 py-2 rounded-full bg-white/10 border border-white/20
                    text-white text-sm' onClick={() => navigate("/pricing")}>
                        <span className="text-xl">🔷</span>
                        <span>{credits}</span>
                        <motion.span
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            ➕
                        </motion.span>
                    </button>
                    <button
                        onClick={() => navigate("/history")}
                        className='px-4 py-3 rounded-full text-sm font-medium
                        bg-white/20 border border-white/20 text-white 
                        hover:bg-white/30 transition flex items-center cursor-pointer gap-2'
                    >
                        📘 Your Notes
                    </button>

                </div>


            </motion.header>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className='mt-6 mb-10'
            >
                <TopicForm
                    setResult={setResult}
                    setLoading={setLoading}
                    loading={loading}
                    setErrors={setErrors}
                />

                {/*{errors && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center font-medium"
                    >
                        ⚠️ {errors}
                    </motion.div>
                )}*/}
            </motion.div>
            {loading && (
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-center text-black font-medium mb-6"
                >
                    Generating exam-focused notes...

                </motion.div>
            )}
            {errors && (
                <div className='mb-6 text-center text-red-600 font-medium'>{errors}</div>
            )}

            {!result && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className='h-64 rounded-2xl flex flex-col items-center
                justify-center bg-white/60 backdrop-blur-lg
                border border-dashed border-gray-300
                text-gray-500
                shadow-inner'
            >
                <span className='text-4xl mb-3'>📘</span>
                <p className='text-sm'>Generate notes will appear here</p>

            </motion.div>}
            {result && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className='flex flex-col
            lg:grid lg:grid-cols-4'>
                <div className='lg:col-span-1'>
                    <Sidebar result={result} />
                </div>
                <div className='ml-4 lg:col-span-3
                rounded-2xl bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)]
                p-4'>
                    <FinalResult result={result} />


                </div>

            </motion.div>}






        </div>

    )
}
export default Notes