import React, { FC, useEffect, useRef, useState } from 'react'

import { C } from '@00-team/utils'

import { FaNewspaper } from '@react-icons/all-files/fa/FaNewspaper'

import './style/braceform.scss'

// const confetti = require('canvas-confetti')

// debug
const modelName = 'Blog'

const BraceForm: FC = () => {
    const BtnsContainer = useRef<HTMLDivElement>(null)

    // is intersecting btns container
    const [iibc, setiibc] = useState(false)
    useEffect(() => {
        if (BtnsContainer.current && !iibc) {
            var observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry && entry.isIntersecting) {
                        setiibc(true)
                        observer.disconnect()
                    }
                },
                {
                    rootMargin: '-75px',
                }
            )

            observer.observe(BtnsContainer.current)
        }
        return () => {
            if (observer) observer.disconnect()
        }
    }, [BtnsContainer])
    const HandleClick = () => {}
    return (
        <div className='brace_form-container'>
            <div className={'form-title title' + C(iibc, 'active')}>
                <span>
                    <div className='icon'>
                        <FaNewspaper size={30} />
                    </div>
                    <div className='holder'>Add {modelName}</div>
                    <div className='icon'>
                        <FaNewspaper size={30} />
                    </div>
                </span>
            </div>
            <div className='form-data'></div>
            <div className='form-footer' ref={BtnsContainer}>
                <button
                    className='main'
                    id='save-btn'
                    onClick={() => HandleClick()}
                >
                    Save
                </button>
                <button>Save and continue editing</button>
                <button>Save and add another</button>
            </div>
        </div>
    )
}

export default BraceForm
