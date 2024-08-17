
'use client'
import { Container, Box, Typography, Button, TextField, Paper, Grid, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import {writeBatch} from 'firebase/firestore'
import { useRouter } from "next/navigation"

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.json())
        .then ((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id] : !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }
        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same namme already exists.")
                return

            } else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        } else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container maxWidth="md">
            <Box sx={{mt: 4, mb: 6, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4"> Generate Flashcards </Typography>
                <Paper sx={{p: 4, width: "100%"}}> 
                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <TextField value={text} onChange={(e) => setText(e.target.value)} label="Enter text" multiline rows={1} variant="outlined" sx={{width: "650px", height: "40px", mb: 2}}/>
                        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{height: "54px", width: "100px", marginLeft:"16px"}}> {' '} Submit </Button>
                    </Box>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx = {{mt: 4, textAlign: 'center'}}>
                    <Typography
                        variant = "h5" 
                        sx={{fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 4

                        }}> Flashcards Preview </Typography>

                    <Grid container spacing = {3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs = {12} sm= {6} md= {4} key= {index}>
                                <CardActionArea onClick={() => handleCardClick(index)}>
                                    <CardContent> 
                                        <Box
                                            sx={{perspective: "1000px",
                                            '& > div' : {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position:'relative',
                                                width:'100%',
                                                height:'200px',
                                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                borderRadius: "30px",
                            
                                            },

                                            '& > div > div' : {
                                                position: 'absolute',
                                                width:'100%',
                                                height:'100%',
                                                backfaceVisibility: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: 2,
                                                boxSizing: "border-box",
                                                borderRadius: "30px", // Ensure the border-radius is applied here
                                                overflow: 'auto',
                        
                                            },
                                            '& > div > div:nth-of-type(1)': {
                                                backgroundColor: "#9BEDFF",
                                            },

                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                                backgroundColor: "#bcf5bc"
                                            
                                            },
                                            
                                        }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        sx={{maxHeight: "100%",
                                                        overflow: "auto", 
                                                        wordBreak: "break-word",
                                                        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                                        fontSize: "1.2rem",
                                                        lineHeight: 1.5,
                                                        color: "#000",
                                                        fontWeight: "bold",
                                                        padding: "10px",
                                                        }}> {flashcard.front} </Typography>
                                                </div>
                                                <div>
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        sx={{maxHeight: "100%", 
                                                        overflow: "auto", 
                                                        wordBreak: "break-word",
                                                        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                                                        fontSize: "1.2rem",
                                                        lineHeight: 1.5,
                                                        color: "#000",
                                                        padding: "10px",
                                                        
                                                        }}> {flashcard.back} </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{mt: 4, display: "flex", justifyContent:'center', marginBottom: "30px"}}>
                        <Button variant="contained" onClick={handleOpen}> Save </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Save Flashcards </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}> Cancel </Button>
                    <Button onClick={saveFlashcards}> Save </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}