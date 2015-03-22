package net.xiayule.reading.utils;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 解决 spring json 返回时间为 时间戳
 * Created by tan on 15-3-22.
 */
@Component
public class JsonDateSerializer extends JsonSerializer<Date> {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Override
    public void serialize(Date date, JsonGenerator gen, SerializerProvider provider)
            throws IOException, JsonProcessingException {
        String formattedDate = dateFormat.format(date);
        gen.writeString(formattedDate);
    }
}