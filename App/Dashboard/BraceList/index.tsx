import React, { FC, Suspense, useEffect, useMemo, useState } from 'react'

import { AiFillFolderAdd } from '@react-icons/all-files/ai/AiFillFolderAdd'
import { GoListUnordered } from '@react-icons/all-files/go/GoListUnordered'
import { IoSend } from '@react-icons/all-files/io5/IoSend'
import { RiSettings5Fill } from '@react-icons/all-files/ri/RiSettings5Fill'

import { Link, useParams } from 'react-router-dom'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    BraceInfoAtom,
    BraceResultAtom,
    BraceSelectAtom,
    ResultOptionsAtom,
    SubmitAction,
} from 'state'

import { Loading, SearchInput, Select, SelectOption } from 'comps'

import { BraceBody } from './Body'
import { BraceHead } from './Head'
import Paginator from './Paginator'

import './style/brace-list.scss'

const Model_opts = [
    {
        label: 'All',
        value: null,
    },
    {
        label: 'Date (New-Old)',
        value: 'date',
    },
    {
        label: 'Date (Old-New)',
        value: 'date_reverse',
    },
]

const BraceList: FC = () => {
    const { app_label, model_name } = useParams()

    const [BraceInfo, UpdateBraceInfo] = useAtom(BraceInfoAtom)

    const UpdateResultOptions = useSetAtom(ResultOptionsAtom)

    useEffect(() => {
        if (!app_label || !model_name) return
        const app_model = `${app_label}/${model_name}`

        UpdateBraceInfo(app_model)
        UpdateResultOptions({ app_model })
    }, [app_label, model_name])

    return (
        <div className='brace-list'>
            <div
                className={`header ${
                    BraceInfo !== 'loading' && BraceInfo.show_search
                        ? ''
                        : 'left'
                }`}
            >
                {BraceInfo !== 'loading' && BraceInfo.show_search && (
                    <div className='search-container'>
                        <SearchInput
                            submit={search => UpdateResultOptions({ search })}
                        />
                        {BraceInfo.search_help_text && (
                            <span>{BraceInfo.search_help_text}</span>
                        )}
                    </div>
                )}

                <div className='options-wrapper title_smaller'>
                    <Link to='add' className='add-container'>
                        <div className='holder'>
                            Add <span className='model_name'>{model_name}</span>
                        </div>
                        <div className='icon'>
                            <AiFillFolderAdd size={24} />
                        </div>
                    </Link>
                    <div className='filter-container'>
                        <Select
                            options={Model_opts}
                            defaultOpt={Model_opts[0]}
                        />
                    </div>
                </div>
            </div>
            <Suspense>
                <Result />
            </Suspense>
        </div>
    )
}

const Result: FC = () => {
    // 007: im not a fan of this layout
    // but its will do for now

    const BraceInfo = useAtomValue(BraceInfoAtom)
    const ResultOptions = useAtomValue(ResultOptionsAtom)
    const [BraceResult, UpdateBraceResult] = useAtom(BraceResultAtom)

    useEffect(() => {
        UpdateBraceResult()
    }, [ResultOptions])

    if (BraceInfo === 'loading') return <Loading />

    return (
        <>
            <div className='actions_order'>
                <Actions />
                <Orders />
            </div>

            <div className='result'>
                <table>
                    <BraceHead
                        headers={BraceInfo.headers}
                        results_length={
                            BraceResult === 'loading'
                                ? 0
                                : BraceResult.results.length
                        }
                    />

                    {BraceResult !== 'loading' && <BraceBody />}
                </table>

                {/* loading under the table for results */}

                {BraceResult === 'loading' && <Loading />}
            </div>
            {BraceResult !== 'loading' && BraceResult.page && (
                <Paginator {...BraceResult.page} />
            )}
        </>
    )
}

const DefaultAction: SelectOption = {
    label: '---Default---',
    value: null,
}

const Actions: FC = () => {
    const BraceInfo = useAtomValue(BraceInfoAtom)
    const { app_label, model_name } = useParams()
    const items = useAtomValue(BraceSelectAtom)
    const [action, setAction] = useState<unknown>(null)
    const UpdateBraceResult = useSetAtom(BraceResultAtom)

    const Options = useMemo(() => {
        if (BraceInfo === 'loading' || !BraceInfo.actions)
            return [DefaultAction]

        return [
            DefaultAction,
            ...BraceInfo.actions.map(({ name, description }) => ({
                label: description,
                value: name,
            })),
        ]
    }, [BraceInfo])

    const Submit = async () => {
        if (typeof action !== 'string' || items.length < 1) return
        // TODO: confirm the action
        if (confirm('Confirm the Action')) {
            await SubmitAction({ app_label, model_name, action, items })
            UpdateBraceResult()
        }
    }

    return (
        <div className='actions-wrapper column-action-wrapper title_small'>
            <div className='actions column-action'>
                <div className='icon'>
                    <RiSettings5Fill className='setting' size={24} />
                </div>
                <div className='holder'>Actions :</div>
            </div>
            <div className='dropdown'>
                <Select
                    onChange={action => setAction(action.value)}
                    options={Options}
                    defaultOpt={DefaultAction}
                />
            </div>
            <div className='send-btn icon' onClick={Submit}>
                <IoSend size={24} />
            </div>
        </div>
    )
}

const Orders: FC = () => {
    return (
        <div className='order-wrapper column-action-wrapper title_small'>
            <button className='orders'>
                <div className='icon'>
                    <GoListUnordered size={24} />
                </div>
                <div className='holder'>Orders</div>
                <div className='icon'>
                    <GoListUnordered size={24} />
                </div>
            </button>
        </div>
    )
}

export default BraceList
