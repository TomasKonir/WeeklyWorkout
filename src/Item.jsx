import React from 'react'

import AddCircleIcon from '@mui/icons-material/AddCircle'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { CircularProgress, Dialog, DialogContent, IconButton, TextField } from '@mui/material'
import AddDialog from './AddDialog'
import ItemAddDialog from './ItemAddDialog'

export default class Item extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addVisible: false,
            addCount: '',
        }

    }

    render() {
        let dialog
        let remaing = this.props.data.weekCount
        let weekCount = this.props.data.weekCount
        let type = this.props.data.type
        let itemClass = 'item'
        let remaingClass = 'item-remaing'
        let buttons = []
        let progress
        if (!isNaN(parseInt(this.props.data.sum))) {
            remaing = this.props.data.weekCount - parseInt(this.props.data.sum)
        }
        if (this.props.data.id === -1) {
            remaing = 'Remaing'
            itemClass = 'item-head'
            buttons.push(<div key='blankAdd' className='item-button-add' />)
            if (this.props.editMode) {
                buttons.push(<div key='blankEdit' className='item-button-add' />)
                buttons.push(<div key='blankDelete' className='item-button-add' />)
            }
        } else {
            let percent = (remaing * 100) / weekCount
            let color = ''
            if (percent <= 0) {
                percent = 0
                color += 'green'
            } else if (percent < 50) {
                color += 'blue'
            } else if (percent < 100) {
                color += 'yellow'
            } else {
                color += 'red'
            }
            remaingClass += ' ' + color

            if (type === 'count') {
                type = ''
            } else if (type === 'time') {
                let minus = remaing < 0 ? '-' : ''
                remaing = Math.abs(remaing)
                let zero0 = (remaing % 60) < 10 ? '0' : ''
                remaing = minus + Math.trunc(remaing / 60) + ':' + zero0 + (remaing % 60)
                zero0 = (weekCount % 60) < 10 ? '0' : ''
                weekCount = Math.trunc(weekCount / 60) + ':' + zero0 + (weekCount % 60)
            }
            if (!isNaN(parseInt(this.props.data.sum))) {
                let r = this.props.data.weekCount - parseInt(this.props.data.sum)
                if (r <= 0) {
                    remaing = 'OK'
                }
            }

            buttons.push(
                <IconButton key='add' className='item-button-add' onClick={() => this.setState({ addVisible: true, addCount: '' })}>
                    <AddCircleIcon />
                </IconButton>
            )
            if (this.props.editMode) {
                buttons.push(
                    <IconButton key='edit' className='item-button-add' onClick={() => this.setState({ editVisible: true })}>
                        <EditIcon />
                    </IconButton>
                )
                buttons.push(
                    <IconButton key='delete' className='item-button-add' onClick={() => this.props.onDelete(this.props.data.id)}>
                        <DeleteIcon />
                    </IconButton>
                )
            }
            progress = <CircularProgress variant='determinate' value={percent} sx={{ color: color }} size='1.5rem' />
        }
        if (this.state.addVisible) {
            dialog = <ItemAddDialog id={this.props.data.id} type={this.props.data.type} onClose={() => this.setState({ addVisible: false })} onAddItem={this.props.addItem} />
        }
        if (this.state.editVisible) {
            dialog = <AddDialog defaults={this.props.data} onClose={() => this.setState({ editVisible: false })} onOk={(name, weekCount, type) => {
                this.props.onEdit(name, weekCount, type, this.props.data.id)
            }} />
        }
        return (
            <div className={itemClass}>
                <div className='item-name'>
                    {this.props.data.name}
                </div>
                <div className={remaingClass}>
                    <div className='item-text-remaing'>
                        {remaing}
                    </div>
                    <div className='item-progress'>
                        {progress}
                    </div>
                </div>
                <div className='item-weekly'>
                    {weekCount}
                </div>
                {buttons}
                {dialog}
            </div>
        )
    }
}