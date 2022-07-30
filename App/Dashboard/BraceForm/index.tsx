import React, { FC, useEffect, useRef, useState } from 'react'

import { C } from '@00-team/utils'

import { FaNewspaper } from '@react-icons/all-files/fa/FaNewspaper'

import confetti from 'canvas-confetti'
import { useParams } from 'react-router-dom'

import { useAtom } from 'jotai'
import { BraceFormAtom, Field } from 'state'

import { Loading, RenderValue } from 'comps'

import './style/braceform.scss'

interface SubmitState {
    [key: string]: unknown
}

const BraceForm: FC = () => {
    const { app_label, model_name, pk } = useParams()
    const [Form, UpdateForm] = useAtom(BraceFormAtom)
    const BtnsContainer = useRef<HTMLDivElement>(null)

    const [SubmitData, setSubmitData] = useState<SubmitState>({})

    var duration = 7 * 1000
    var animationEnd = Date.now() + duration
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    const HandleClick = () => {
        var interval: any = setInterval(function () {
            var timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            var particleCount = 50 * (timeLeft / duration)
            // since particles fall down, start a bit higher than random
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                })
            )
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                })
            )
        }, 250)
    }

    const Submit = () => {
        console.log(SubmitData)
    }

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

    useEffect(() => {
        UpdateForm({
            app_label,
            model_name,
            end_url: pk === undefined ? 'add/' : `change/?pk=${pk}`,
        })
    }, [app_label, model_name, pk])

    if (Form === 'loading') return <Loading />

    return (
        <div className='brace_form-container'>
            <FormTitle />
            <div className='form-data'>
                {Form.fieldsets.map((fset, idx0) => (
                    <div key={idx0} className='fieldset'>
                        {fset.name && <h2>{fset.name}</h2>}
                        {fset.description && <p>{fset.description}</p>}
                        {fset.fields.map((f, idx1) => (
                            <div key={idx1}>
                                <label>{f.name}:</label>
                                <RenderFieldInput
                                    f={f}
                                    onChange={v =>
                                        setSubmitData(s => {
                                            s[f.name] = v
                                            return s
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div
                className={'form-footer title_small' + C(iibc)}
                ref={BtnsContainer}
            >
                <button style={{ animationDelay: '0.5s' }}>
                    Save and add another
                </button>
                <button
                    style={{ animationDelay: '1.5s' }}
                    onClick={() => Submit()}
                >
                    Save and continue editing
                </button>
                <button
                    style={{ animationDelay: '1s' }}
                    className='main'
                    id='save-btn'
                    onClick={() => HandleClick()}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

const FormTitle: FC = () => {
    const { model_name, pk } = useParams()
    const [Form] = useAtom(BraceFormAtom)

    const title = () => {
        if (pk === undefined) return `Add ${model_name}`
        if (Form === 'loading') return `Change ${pk}`
        return `Change ${Form.label}`
    }

    return (
        <div className='form-title title'>
            <span>
                <div className='icon'>
                    <FaNewspaper size={30} />
                </div>
                <div className='holder'>{title()}</div>
                <div className='icon'>
                    <FaNewspaper size={30} />
                </div>
            </span>
        </div>
    )
}

interface FieldInputProps {
    f: Field
    onChange: (v: unknown) => void
}

const RenderFieldInput: FC<FieldInputProps> = ({ f, onChange }) => {
    switch (f.type) {
        case 'unknown':
            return <>Unknown Field</>

        case 'char':
            // TODO: defaultValue is wrong!
            return (
                <input
                    type={'text'}
                    defaultValue={f.value || f.initial}
                    maxLength={f.max_length}
                    onChange={e => onChange(e.target.value)}
                />
            )

        case 'boolean':
            return (
                <input
                    type={'checkbox'}
                    defaultChecked={f.initial}
                    onChange={e => onChange(e.target.checked)}
                />
            )

        case 'foreign_key':
            return (
                <>
                    this should be a select \
                    {f.choices.map((c, i) => (
                        <span key={i}>
                            ( {c[0]} | {c[1]} )
                        </span>
                    ))}
                </>
            )

        case 'date':
            const date = f.value ? f.value[1] : f.initial
            return (
                <input
                    type={'date'}
                    defaultValue={date}
                    onChange={e => onChange(e.target.value)}
                />
            )

        case 'datetime':
            let datetime = f.value ? f.value[1] : f.initial
            datetime = new Date(datetime).toISOString().slice(0, -5)

            return (
                <input
                    type={'datetime-local'}
                    defaultValue={datetime}
                    onChange={e => onChange(e.target.value)}
                />
            )

        case 'image':
            return (
                <input
                    type='file'
                    accept='image/*'
                    onChange={e => onChange(e.target.value)}
                />
            )

        case 'readonly':
            return <RenderValue v={f.value || null} />

        case 'text':
            return (
                <textarea
                    defaultValue={f.value || f.initial}
                    onChange={e => onChange(e.target.value)}
                />
            )

        case 'int':
            return (
                <input
                    type='number'
                    min={f.min}
                    defaultValue={f.value || f.initial}
                    onChange={e => onChange(e.target.value)}
                />
            )

        default:
            return <></>
    }
}

export default BraceForm
