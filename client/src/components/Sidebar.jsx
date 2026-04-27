import React from 'react'
import { motion } from 'motion/react'

function Sidebar({ result }) {
    if (!result || !result.data) {
        return null;
    }
    const { subTopics, questions, importance } = result.data;

    return (
        <div className='rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-6'>
            <div className='flex items-center gap-2'>
                <span className='text-lg'>📌</span>
                <h3 className='text-lg font-semibold text-indigo-600'>
                    Quick Exam View
                </h3>
            </div>

            {subTopics && (
                <section>
                    <p className='text-sm font-semibold text-gray-700 mb-3'>
                        ⭐ Sub Topics (Priority wise)
                    </p>
                    {Object.entries(subTopics).map(([star, topics]) => (
                        <div key={star} className='mb-3 rounded-lg bg-gray-50 border border-gray-200 p-3'>
                            <p className='text-sm font-semibold text-yellow-600 mb-1'>{star} Priority</p>
                            <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
                                {topics && topics.map((t, i) => (
                                    <li key={i}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            <section className='rounded-lg bg-yellow-50 border border-yellow-200 p-3'>
                <p className='text-sm font-semibold text-gray-700 mb-1'>
                    🔥 Exam Importance
                </p>
                <span className='text-yellow-700 font-bold text-sm'>{importance}</span>

                <p className='text-sm font-semibold text-gray-700 mt-4 mb-3'>
                    ❓ Important Questions
                </p>

                {questions?.short && questions.short.length > 0 && (
                    <div className='mb-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3'>
                        <p className='text-sm font-semibold text-gray-700 mb-1'>
                            Short Questions
                        </p>
                        <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
                            {questions.short.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {questions?.long && questions.long.length > 0 && (
                    <div className='mb-4 rounded-lg bg-purple-50 border border-purple-200 p-3'>
                        <p className='text-sm font-semibold text-gray-700 mb-1'>
                            Long Questions
                        </p>
                        <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
                            {questions.long.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {questions?.diagram && (
                    <div className='rounded-lg bg-blue-50 border border-blue-200 p-3'>
                        <p className='text-sm font-semibold text-gray-700 mb-1'>
                            Diagram Questions
                        </p>
                        <ul className='list-disc ml-4 text-sm text-gray-700 space-y-1'>
                            <li>{questions.diagram}</li>
                        </ul>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Sidebar