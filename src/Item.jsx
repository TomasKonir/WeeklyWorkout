import React from 'react'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { CircularProgress, Dialog, DialogContent, IconButton, TextField } from '@mui/material'
import AddDialog from './AddDialog'

export default class Item extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addVisible: false,
            addCount: '',
        }
        this.add = this.add.bind(this)
    }

    add() {
        let radix = 10
        if (this.state.addCount.startsWith('0x')) {
            radix = 16
        }
        let number = parseInt(this.state.addCount, radix)
        if (isNaN(number) || number < 1) {
            return
        }
        this.setState({ addVisible: false, addCount: '' })
        this.props.addItem(this.props.data.id, number)
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
                let zero = (remaing % 60) < 10 ? '0' : ''
                remaing = Math.trunc(remaing / 60) + ':' + zero + (remaing % 60)
                zero = (weekCount % 60) < 10 ? '0' : ''
                weekCount = Math.trunc(weekCount / 60) + ':' + zero + (weekCount % 60)
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
            progress = <CircularProgress variant='determinate' value={percent} sx={{color : color}} size='1.5rem' />
        }
        if (this.state.addVisible) {
            dialog = <Dialog open={true} onClose={() => this.setState({ addVisible: false })}>
                <DialogContent className='flex-row' sx={{ padding: '0.5rem 0.25rem 0.5rem 0.25rem' }}>
                    <IconButton onClick={() => this.setState({ addVisible: false })}>
                        <CloseIcon />
                    </IconButton>
                    <TextField
                        autoFocus
                        autoComplete='off'
                        fullWidth
                        size='small'
                        variant='outlined'
                        value={this.state.addCount === null ? '' : this.state.addCount}
                        placeholder={this.props.data.type === 'count' ? 'count' : 'minutes'}
                        label={this.props.data.type === 'count' ? 'count' : 'minutes'}
                        onChange={(ev) => {
                            let val = ev.target.value
                            let radix = 10
                            if (val.startsWith('0x')) {
                                radix = 16
                            }
                            let test = parseInt(val, radix)
                            if (!isNaN(test) || val.length === 0 || radix === 16) {
                                this.setState({ addCount: val })
                            }
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                // Do code here
                                ev.preventDefault()
                                this.add()
                            }
                        }}
                    />
                    <IconButton disabled={this.state.addCount === '0' || this.state.addCount === ''} onClick={this.add}>
                        <DoneIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>
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