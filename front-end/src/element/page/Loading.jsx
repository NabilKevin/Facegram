import { useState } from "react"

const Loading = () => {
    const [dot, setDot] = useState('.')
    setTimeout(() => {
        if(dot === '...') {
            setDot('.')
        } else {
            setDot(dot + '.')
        }
    }, 500)
    return (
        <div className="center">
            <h1>Loading{dot}</h1>
        </div>
    )
}

export default Loading