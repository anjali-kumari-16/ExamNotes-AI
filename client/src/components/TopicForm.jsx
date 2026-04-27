import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../utils/config'

function TopicForm({ setResult, setLoading, loading, setErrors }) {
    const [topic, setTopic] = useState("")
    const [classLevel, setClassLevel] = useState("")
    const [examType, setExamType] = useState("")
    const [revisionMode, setRevisionMode] = useState(false)
    const [includeDiagram, setIncludeDiagram] = useState(false)
    const [includeChart, setIncludeChart] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressTest, setProgressTest] = useState("")


    const handleSubmit = async (e) => {
        if (!topic.trim()) {
            setErrors("Please enter a topic");
            return;
        }
        setErrors("")
        setLoading(true)
        try {
            const response = await axios.post(`${serverUrl}/api/generate/notes`, {
                topic,
                classLevel,
                examType,
                revisionMode,
                includeDiagram,
                includeChart
            }, { withCredentials: true })

            if (response.data) {
                console.log("Generation Response:", response.data);
                setResult(response.data)
            }
            setClassLevel("");
            setTopic("");
            setExamType("");
            setIncludeChart(false);
            setIncludeDiagram(false);
            setRevisionMode(false);

        } catch (error) {
            console.error("TopicForm Error", error)
            setErrors(error.response?.data?.message || "Failed to generate notes. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (!loading) {
            setProgress(0);
            setProgressTest("");
            return;
        }
        let value = 0;
        const interval = setInterval(() => {
            value += Math.random() * 8;
            if (value >= 95) {
                value = 95;
                setProgressTest("Almost done...");
                clearInterval(interval);


            } else if (value > 70) {
                setProgressTest("Finalizing Notes...");

            } else if (value > 40) {
                setProgressTest("Processing content...");

            } else {
                setProgressTest("Generating Notes...");
            }
            setProgress(Math.floor(value))

        }, 700)
        return () => clearInterval(interval);

    }, [loading])



    return (

        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className={`flex flex-col gap-6 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/10 
        px-8 py-10 text-white shadow-[0_20px_45px_rgba(0,0,0,0.75)]`}>
            <input type="text" className={`w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
            border border-white/20 placeholder-gray-400 text-white
            outline-none focus:border-white/50`} placeholder='Enter topic (e.g web Development)'
                onChange={(e) => setTopic(e.target.value)} value={topic} />
            <input type="text" className={`w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
            border border-white/20 placeholder-gray-400 text-white
            outline-none focus:border-white/50`} placeholder='Class / Level (e.g Class 10)'
                onChange={(e) => setClassLevel(e.target.value)} value={classLevel} />
            <input type="text" className={`w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg
            border border-white/20 placeholder-gray-400 text-white
            outline-none focus:border-white/50`} placeholder='Exam Type (CBSE,JEE,NEET,etc)'
                onChange={(e) => setExamType(e.target.value)} value={examType} />
            <div className='flex flex-col md:flex-row gap-6'>
                <Toggle
                    label="Revision Mode"
                    checked={revisionMode}
                    onChange={() => setRevisionMode(!revisionMode)}
                />
                <Toggle
                    label="Include Diagrams"
                    checked={includeDiagram}
                    onChange={() => setIncludeDiagram(!includeDiagram)}
                />
                <Toggle
                    label="Include Charts"
                    checked={includeChart}
                    onChange={() => setIncludeChart(!includeChart)}
                />

            </div>
            <motion.button
                whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={!loading ? handleSubmit : undefined}
                className={`
                w-full mt-4 py-3 rounded-xl cursor-pointer
                font-semibold flex items-center justify-center gap-3
                transition-all ${loading ? "bg-gray-500 cursor-not-allowed opacity-70" :
                        "bg-gradient-to-br from-white to-gray-200 text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    }`}>
                {loading ? "Generating Notes... " : "Generate Notes"}

            </motion.button>
            {loading &&
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">{progressTest}</span>
                        <span className="text-gray-300">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>}





        </motion.div>
    )
}
function Toggle({ label, checked, onChange }) {
    return (
        <div className='flex items-center gap-4 cursor-pointer select-none' onClick={onChange}>
            <motion.div
                animate={{
                    backgroundColor: checked
                        ? "rgba(34,197,94,0.35)" // green when on
                        : "rgba(255,255,255,0.15)" // gray when off
                }}
                transition={{ duration: 0.25 }}
                className='relative w-12 h-6 rounded-full
              border border-white/20  backdrop-blur-lg'>
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className='absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]'
                    style={{ left: checked ? "1.6rem" : "0.25rem" }}
                />
            </motion.div>
            <span className={`text-sm transition-colors ${checked ? "text-green-400" : "text-gray-300"}`}>
                {label}
            </span>

        </div>
    )

}

export default TopicForm
