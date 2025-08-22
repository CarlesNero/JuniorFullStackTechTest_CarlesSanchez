type Props = {
    onButtonClick : () => void
}

const NewMatchBtn = (props: Props) => {
  return (
     <button 
          className="px-2 p-1 bg-blue-500 rounded text-white cursor-pointer font-bold shadow hover:bg-blue-400" 
          onClick={props.onButtonClick}
        >
          Create new game
        </button>
  )
}

export default NewMatchBtn