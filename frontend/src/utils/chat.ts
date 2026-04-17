/* Get random initial message for conversation */
export const getRandomGreeting = () => {
    const GREETINGS_POOL = [
        "Hey there! 👋 What can I help you with today?",
        "Welcome! Ready to explore your documents?",
        "Hi! Ask me anything about your uploaded files.",
        "Hello! Let’s dive into your documents.",
        "Good to see you! What would you like to know?"
    ]

    return GREETINGS_POOL[Math.floor(Math.random() * GREETINGS_POOL.length)]
}