import { useEffect, useRef, useState } from 'react'
import { Box, Button, Collapse } from '@mui/material'

const Expandable = ({
  children,
  size = 100,
  buttonBorderRadiusTop = false
}) => {
  const [expanded, setExpanded] = useState(false)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const contentRef = useRef(null)

  const toggleExpand = () => setExpanded(prev => !prev)

  useEffect(() => {
    if (contentRef.current) {
      setShouldCollapse(contentRef.current.scrollHeight > size)
    }
  }, [children, size])
  return (
    <Box sx={{ position: 'relative' }}>
      {!shouldCollapse ? (
        <div ref={contentRef}>{children}</div>
      ) : (
        <Collapse in={expanded || !shouldCollapse} collapsedSize={size}>
          <div ref={contentRef}>{children}</div>
        </Collapse>
      )}

      {shouldCollapse && (
        <div>
          {expanded ? (
            <Button
              onClick={toggleExpand}
              variant="contained"
              sx={{
                width: '100%',
                marginTop: '5px',
                borderRadius: '8px'
              }}
            >
              Show Less
            </Button>
          ) : (
            <Button
              onClick={toggleExpand}
              variant="contained"
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderRadius: buttonBorderRadiusTop ? '8px' : '8px 8px 0px 0px'
              }}
            >
              Show More
            </Button>
          )}
        </div>
      )}
    </Box>
  )
}

export default Expandable
