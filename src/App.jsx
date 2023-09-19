import 'material-design-icons/iconfont/material-icons.css'
import "@fontsource/roboto"

import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { IconButton, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ReplayIcon from '@mui/icons-material/Replay'

import { callApi, isWaitingApi } from './utils'
import AddDialog from './AddDialog'
import Item from './Item'

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        button: {
            textTransform: 'none'
        },
        "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500,
    },
})

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addVisible: false,
            editMode: false,
            list: [],
        }

        this.reload = this.reload.bind(this)
        this.loadList = this.loadList.bind(this)
        this.loadErr = this.loadErr.bind(this)
        this.addWorkout = this.addWorkout.bind(this)
        this.addItem = this.addItem.bind(this)
        this.deleteWorkout = this.deleteWorkout.bind(this)
        this.editWorkout = this.editWorkout.bind(this)
    }

    componentDidMount() {
        this.reload()
        this.timer = setInterval(() => {
            if (this.state.addVisible === false) {
                this.reload()
            }
        }, 60 * 1000)
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }


    reload() {
        let d = new Date()
        let day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
        let monday = new Date(d.setDate(diff))
        monday.setHours(0)
        monday.setMinutes(0)
        monday.setSeconds(0)
        monday.setMilliseconds(0)
        callApi('list', { monday: monday.getTime() }, this.loadList, this.loadErr)
        this.forceUpdate()
    }

    loadList(list) {
        this.setState({ list: list })
    }

    loadErr(err) {
        console.info(err)
        this.forceUpdate()
    }

    addWorkout(name, weekCount, type) {
        callApi('addWorkout', { name: name, weekCount: weekCount, type: type }, this.reload, this.loadErr)
        this.forceUpdate()
    }

    addItem(id, count) {
        let time = new Date().getTime()
        callApi('addItem', { id: id, count: count, time: time }, this.reload, this.loadErr)
        this.forceUpdate()
    }

    deleteWorkout(id) {
        if (window.confirm('Really delete workout?')) {
            callApi('deleteWorkout', { id: id }, this.reload, this.loadErr)
            this.forceUpdate()
        }
    }

    editWorkout(name, weekCount, type, id) {
        callApi('editWorkout', { id: id, name: name, weekCount: weekCount, type: type }, this.reload, this.loadErr)
        this.forceUpdate()
    }

    render() {
        let content = []
        let className = 'body'
        let editSx = {}
        let addSx = {}
        let reloadButton
        if (window.isMobile) {
            className += ' mobile'
        }
        let dialog
        if (this.state.addVisible) {
            dialog = <AddDialog onClose={() => this.setState({ addVisible: false })} onOk={this.addWorkout} />
        }
        for (let i in this.state.list) {
            content.push(<Item key={this.state.list[i].id} data={this.state.list[i]} editMode={this.state.editMode} addItem={this.addItem} onDelete={this.deleteWorkout} onEdit={this.editWorkout} />)
        }
        if (this.state.editMode) {
            editSx.color = 'white'
        } else {
            editSx.color = 'gray'
            addSx.visibility = 'hidden'
        }
        if (isWaitingApi()) {
            reloadButton = <img src='waiting.svg' alt='wi' style={{ width: '2.5rem', height: '2.5rem', marginTop: 'auto', marginBottom: 'auto' }} />
        } else {
            reloadButton = <IconButton onClick={this.reload}><ReplayIcon /></IconButton>
        }
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline key="css" />
                <Paper className={className} square>
                    <div className='headline'>
                        <div className='centered-vertical flex-grow green'>Weekly Workouts</div>
                        <IconButton sx={addSx} onClick={() => this.setState({ addVisible: true })}>
                            <AddIcon />
                        </IconButton>
                        <IconButton sx={editSx} onClick={() => this.setState({ editMode: !this.state.editMode })}>
                            <EditIcon />
                        </IconButton>
                        {reloadButton}
                    </div>
                    <div className='content'>
                        {content}
                    </div>
                    {dialog}
                </Paper>
            </ThemeProvider>
        )
    }
}

